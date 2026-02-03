using System;
using MediatR;
using OMAB.Application.Cores;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;

namespace OMAB.Application.Features.Appointments.Commands;

public class DeleteReview
{
    public record Command(int AppointmentId) : IRequest<Result<Unit>>;
    public class Handler(
        IUserAccessor userAccessor,
        IDoctorRepository doctorRepository,
        IAppointmentRepository appointmentRepository,
        IUnitOfWork unitOfWork
    ) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken ct)
        {
            var userId = userAccessor.GetCurrentUserId();
            var appointment = await appointmentRepository.GetWithReviewAsync(request.AppointmentId, ct);

            if (appointment == null)
                return Result<Unit>.Failure("Appointment Not Found", 404);
            if (appointment.PatientId != userId)
                return Result<Unit>.Failure("Unauthorized", 403); // 403 chuẩn hơn 401 khi đã login nhưng không có quyền
            if (appointment.Review == null)
                return Result<Unit>.Failure("Review Not Found", 404);

            int oldRating = appointment.Review.Rating;
            appointment.RemoveReview();
            var doctor = await doctorRepository.GetByIdAsync(appointment.DoctorId, ct);
            if (doctor == null)
                return Result<Unit>.Failure("Doctor Not Found", 404);
            doctor.RemoveReview(oldRating);

            var result = await unitOfWork.SaveChangesAsync(ct);
            if (result <= 0)
                return Result<Unit>.Failure("Failed to delete review", 500);
            return Result<Unit>.Success(Unit.Value);
        }
    }
}
