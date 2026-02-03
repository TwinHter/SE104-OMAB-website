using System;
using Microsoft.EntityFrameworkCore;
using OMAB.Application;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;

namespace OMAB.Infrastructure.Persistence.Repositories;

public class DoctorRepository : GenericRepository<Doctor>, IDoctorRepository
{
    public DoctorRepository(AppDbContext context) : base(context) { }


    public async Task<Doctor?> GetDoctorWithSpecialtyAsync(int doctorId, CancellationToken ct = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(d => d.User)
            .Include(d => d.DoctorSpecialties)
                .ThenInclude(ds => ds.Specialty)
            .FirstOrDefaultAsync(d => d.UserId == doctorId, ct);
    }

    public async Task<IEnumerable<Doctor>> GetFilteredDoctorsAsync(DoctorFilter filter, CancellationToken ct = default)
    {
        var query = _dbSet
            .AsNoTracking()
            .Include(d => d.User)
            .Include(d => d.DoctorSpecialties)
                .ThenInclude(ds => ds.Specialty)
            .AsQueryable();

        if (filter.SpecialtyId.HasValue)
        {
            query = query.Where(d => d.DoctorSpecialties.Any(ds => ds.SpecialtyId == filter.SpecialtyId.Value));
        }

        if (filter.MinimumExperience.HasValue)
        {
            query = query.Where(d => d.ExperienceYears >= filter.MinimumExperience.Value);
        }

        if (filter.MinimumRating.HasValue)
        {
            query = query.Where(d => d.Rating >= filter.MinimumRating.Value);
        }

        if (filter.IsAvailable.HasValue)
        {
            query = query.Where(d => d.IsActive == filter.IsAvailable.Value);
        }

        if (filter.MinimumConsultationFee.HasValue)
        {
            query = query.Where(d => d.ConsultationFee >= filter.MinimumConsultationFee.Value);
        }

        if (filter.MaximumConsultationFee.HasValue)
        {
            query = query.Where(d => d.ConsultationFee <= filter.MaximumConsultationFee.Value);
        }

        return await query.ToListAsync(ct);
    }

    public async Task<decimal> CalculateAvgRatingAsync(int doctorId, CancellationToken ct)
    {
        var result = await _context.Reviews.AsNoTracking()
            .Where(r => r.Appointment.DoctorId == doctorId)
            .AverageAsync(r => (decimal?)r.Rating, ct);
        return result != null ? Math.Round(result.Value, 2) : 0;
    }

    public async Task<List<DoctorSchedule>> GetScheduleByDoctorAndDayAsync(int doctorId, DayOfWeek day, CancellationToken ct = default)
    {
        return await _context.DoctorSchedules
            .AsNoTracking()
            .Where(ds => ds.DoctorId == doctorId && ds.DayOfWeek == day)
            .ToListAsync(ct);
    }

    public async Task<Doctor?> GetByIdWithSchedulesAsync(int doctorId, CancellationToken ct)
    {
        return await _dbSet
            .Include(d => d.DoctorSchedules)
            .FirstOrDefaultAsync(d => d.UserId == doctorId, ct);
    }
}
