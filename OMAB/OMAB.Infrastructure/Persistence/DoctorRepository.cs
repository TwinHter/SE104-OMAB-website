using System;
using Microsoft.EntityFrameworkCore;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;

namespace OMAB.Infrastructure.Persistence;

public class DoctorRepository : GenericRepository<Doctor>, IDoctorRepository
{
    public DoctorRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Doctor>> GetActiveDoctorsAsync(CancellationToken ct = default)
    {
        return await _dbSet.AsNoTracking().Where(d => d.IsActive).ToListAsync(ct);
    }

    public async Task<IEnumerable<Doctor>> GetBySpecialtyAsync(int specialtyId, CancellationToken ct = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(d => d.User)
            .Where(d => d.DoctorSpecialties.Any(ds => ds.SpecialtyId == specialtyId))
            .ToListAsync(ct);
    }

    public async Task<Doctor?> GetDoctorWithSpecialtyAsync(int doctorId, CancellationToken ct = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(d => d.User)
            .Include(d => d.DoctorSpecialties)
                .ThenInclude(ds => ds.Specialty)
            .FirstOrDefaultAsync(d => d.UserId == doctorId, ct);
    }
}
