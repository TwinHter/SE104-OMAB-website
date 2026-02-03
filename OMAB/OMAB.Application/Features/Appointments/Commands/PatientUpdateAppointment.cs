using System;
using System.Data;
using FluentValidation;
using MediatR;
using OMAB.Application.Cores;
using OMAB.Application.Features.Appointments.DTOs;
using OMAB.Application.Interfaces;

namespace OMAB.Application.Features.Appointments.Commands;

public class PatientUpdateAppointment
{
    public record Command(int AppointmentId, UpdateAppointmentByPatientDto UpdateDto) : IRequest<Result<int>>;

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            // RuleFor(x => x.UpdateDto.PaymentStatus)
            //     .IsInEnum()
            //     .WithMessage("Invalid payment status.").When(x => x.UpdateDto.PaymentStatus.HasValue);
        }
    }
    public class Handler(IUserAccessor userAccessor, IAppointmentRepository appointmentRepository, IUnitOfWork unitOfWork) : IRequestHandler<Command, Result<int>>
    {
        public async Task<Result<int>> Handle(Command request, CancellationToken cancellationToken)
        {
            var appointment = await appointmentRepository.GetByIdAsync(request.AppointmentId, cancellationToken);
            if (appointment == null)
                return Result<int>.Failure("Appointment not found.", 404);

            var patientId = userAccessor.GetCurrentUserId();

            if (appointment.PatientId != patientId)
                return Result<int>.Failure("Not Authorized", 403);

            if (request.UpdateDto.PatientNotes != null)
                appointment.PatientUpdate(request.UpdateDto.PatientNotes);

            appointmentRepository.Update(appointment);
            var result = await unitOfWork.SaveChangesAsync(cancellationToken);
            return Result<int>.Success(appointment.Id);
        }
    }
}
