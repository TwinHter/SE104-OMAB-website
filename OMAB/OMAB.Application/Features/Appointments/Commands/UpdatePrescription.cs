using System;
using MediatR;
using OMAB.Application.Cores;
using OMAB.Application.Features.Appointments.DTOs;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;

namespace OMAB.Application.Features.Appointments.Commands;

public class UpdatePrescription
{
    public record Command(int AppointmentId, List<PrescriptionItem> Items) : IRequest<Result<int>>;

    public class Handler(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IAppointmentRepository appointmentRepository) : IRequestHandler<Command, Result<int>>
    {
        public async Task<Result<int>> Handle(Command request, CancellationToken ct)
        {
            var doctorId = userAccessor.GetCurrentUserId();
            var appointment = await appointmentRepository.GetWithPrescriptionAsync(request.AppointmentId, ct);

            if (appointment == null)
                return Result<int>.Failure("Appointment not found.", 404);
            if (appointment.DoctorId != doctorId)
                return Result<int>.Failure("Not Authorized.", 403);

            var prescriptionEntities = request.Items.Select(item => new Prescription(appointment.Id, item.MedicineId, item.Dosage, item.Frequency)).ToList();
            appointment.UpsertPrescription(prescriptionEntities);

            var result = await unitOfWork.SaveChangesAsync(ct);
            if (result <= 0)
                return Result<int>.Failure("Failed to upsert prescription.", 400);
            return Result<int>.Success(request.AppointmentId);
        }
    }
}
