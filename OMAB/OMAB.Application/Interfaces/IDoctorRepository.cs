using System;
using OMAB.Domain.Entities;

namespace OMAB.Application.Interfaces;

public interface IDoctorRepository : IGenericRepository<Doctor>
{
    Task<Doctor?> GetDoctorWithSpecialtyAsync(int doctorId, CancellationToken ct = default);

    Task<IEnumerable<Doctor>> GetBySpecialtyAsync(int specialtyId, CancellationToken ct = default);

    Task<IEnumerable<Doctor>> GetActiveDoctorsAsync(CancellationToken ct = default);
}
