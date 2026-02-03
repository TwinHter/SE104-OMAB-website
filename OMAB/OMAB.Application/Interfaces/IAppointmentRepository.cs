using System;
using OMAB.Application.Models;
using OMAB.Domain.Entities;

namespace OMAB.Application.Interfaces;

public interface IAppointmentRepository : IGenericRepository<Appointment>
{
    Task<IEnumerable<Appointment>> GetByFilterAsync(AppointmentFilter filter, CancellationToken ct = default);
    Task<Appointment?> GetFullDetailAsync(int appointmentId, CancellationToken ct = default);
    Task<Appointment?> GetWithPrescriptionAsync(int appointmentId, CancellationToken ct = default);
    Task<Appointment?> GetWithReviewAsync(int appointmentId, CancellationToken ct = default);
    Task<List<Appointment>> GetDoctorAppointmentsOnDateAsync(int doctorId, DateOnly date, CancellationToken ct = default);

    Task<bool> IsSlotAvailableAsync(int doctorId, DateTime startTime, DateTime endTime, CancellationToken ct = default);
}
