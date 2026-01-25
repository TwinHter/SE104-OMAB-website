using Microsoft.EntityFrameworkCore;
using OMAB.Application.Interfaces;
using OMAB.Application.Models;
using OMAB.Domain.Entities;

namespace OMAB.Infrastructure.Persistence;

public class AppointmentRepository : GenericRepository<Appointment>, IAppointmentRepository
{
    public AppointmentRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Appointment>> GetByFilter(AppointmentFilter filter, CancellationToken ct = default)
    {
        var query = _dbSet.AsNoTracking().AsQueryable();

        if (filter.PatientId.HasValue)
        {
            query = query.Where(a => a.PatientId == filter.PatientId.Value);
        }

        if (filter.DoctorId.HasValue)
        {
            query = query.Where(a => a.DoctorId == filter.DoctorId.Value);
        }

        if (filter.Status.HasValue)
        {
            query = query.Where(a => a.Status == filter.Status.Value);
        }

        if (filter.PaymentStatus.HasValue)
        {
            query = query.Where(a => a.PaymentStatus == filter.PaymentStatus.Value);
        }
        return await query.ToListAsync(ct);
    }

    public async Task<Appointment?> GetById(int id, CancellationToken ct = default)
    {
        return await _dbSet.AsNoTracking().Include(a => a.Patient)
                           .Include(a => a.Doctor)
            .FirstOrDefaultAsync(a => a.Id == id, ct);
    }
}
