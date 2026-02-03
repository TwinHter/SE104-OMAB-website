using System;
using OMAB.Domain.Entities;

namespace OMAB.Application.Interfaces;

public interface IDoctorRepository : IGenericRepository<Doctor>
{
    Task<Doctor?> GetDoctorWithSpecialtyAsync(int doctorId, CancellationToken ct = default);

    Task<IEnumerable<Doctor>> GetFilteredDoctorsAsync(DoctorFilter filter, CancellationToken ct = default);

    Task<decimal> CalculateAvgRatingAsync(int doctorId, CancellationToken ct);

    Task<List<DoctorSchedule>> GetScheduleByDoctorAndDayAsync(int doctorId, DayOfWeek day, CancellationToken ct = default);

    Task<Doctor?> GetByIdWithSchedulesAsync(int doctorId, CancellationToken ct);
}
