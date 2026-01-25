using Microsoft.EntityFrameworkCore;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;

namespace OMAB.Infrastructure.Persistence;

public class PrescriptionRepository : GenericRepository<Prescription>, IPrescriptionRepository
{
    public PrescriptionRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Prescription>> GetByAppointmentIdAsync(int appointmentId, CancellationToken ct = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(p => p.AppointmentId == appointmentId)
            .ToListAsync(ct);
    }
}