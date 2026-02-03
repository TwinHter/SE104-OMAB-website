using FluentValidation;
using MediatR;
using OMAB.Application.Cores;
using OMAB.Application.Features.Appointments.DTOs;
using OMAB.Application.Interfaces;
using OMAB.Domain.Enums;

namespace OMAB.Application.Features.Appointments.Commands;

public class DoctorUpdateAppointment
{
    // DTO nên cho phép null để biết user muốn update trường nào
    public record Command(int AppointmentId, UpdateAppointmentByDoctorDto UpdateDto) : IRequest<Result<int>>;

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.AppointmentId).GreaterThan(0);
            RuleFor(x => x.UpdateDto.AppointmentDate)
                .LessThan(x => x.UpdateDto.AppointmentEndTime)
                .When(x => x.UpdateDto.AppointmentDate.HasValue && x.UpdateDto.AppointmentEndTime.HasValue)
                .WithMessage("Appointment end time must be after appointment date.");
            RuleFor(x => x.UpdateDto.AppointmentDate)
                .GreaterThan(DateTime.UtcNow)
                .When(x => x.UpdateDto.AppointmentDate.HasValue)
                .WithMessage("Appointment date must be in the future.");
            RuleFor(x => x.UpdateDto.AppointmentDate)
                .Must(BeOnHourOrHalfHour)
                .When(x => x.UpdateDto.AppointmentDate.HasValue)
                .WithMessage("Appointment date must be on the hour or half hour.");

            RuleFor(x => x.UpdateDto.AppointmentEndTime)
                .Must(BeOnHourOrHalfHour)
                .When(x => x.UpdateDto.AppointmentEndTime.HasValue)
                .WithMessage("Appointment end time must be on the hour or half hour.");
        }

        private bool BeOnHourOrHalfHour(DateTime? date)
        {
            if (!date.HasValue) return true;
            return date.Value.Minute == 0 || date.Value.Minute == 30;
        }
    }

    public class Handler(
        IUserAccessor userAccessor,
        IUnitOfWork unitOfWork,
        IAppointmentRepository appointmentRepository
    ) : IRequestHandler<Command, Result<int>>
    {
        public async Task<Result<int>> Handle(Command request, CancellationToken ct)
        {
            var doctorId = userAccessor.GetCurrentUserId();
            var appointment = await appointmentRepository.GetByIdAsync(request.AppointmentId, ct);

            if (appointment == null) return Result<int>.Failure("Appointment not found.", 404);
            if (appointment.DoctorId != doctorId) return Result<int>.Failure("Not Authorized", 403);
            if (appointment.Status == AppointmentStatus.Completed || appointment.Status == AppointmentStatus.Cancelled)
            {
                return Result<int>.Failure("Cannot update a completed or cancelled appointment.", 400);
            }

            appointment.UpdateAppointment(
                status: request.UpdateDto.Status,
                appointmentDate: request.UpdateDto.AppointmentDate,
                diseaseId: request.UpdateDto.DiseaseId,
                notes: request.UpdateDto.Notes,
                fee: request.UpdateDto.Fee,
                appointmentEndTime: request.UpdateDto.AppointmentEndTime
            );


            var result = await unitOfWork.SaveChangesAsync(ct);

            if (result <= 0)
                return Result<int>.Failure("Failed to update appointment.", 400);
            return Result<int>.Success(appointment.Id);
        }
    }
}
