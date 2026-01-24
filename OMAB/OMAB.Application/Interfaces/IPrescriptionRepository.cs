using System;
using OMAB.Domain.Entities;

namespace OMAB.Application.Interfaces;

public interface IPrescriptionRepository : IGenericRepository<Prescription>
{
    Task<IEnumerable<Prescription>> GetByAppointmentIdAsync(int appointmentId, CancellationToken ct = default);
}
