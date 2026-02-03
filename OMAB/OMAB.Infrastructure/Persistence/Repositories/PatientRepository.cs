using System;
using Microsoft.EntityFrameworkCore;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;

namespace OMAB.Infrastructure.Persistence.Repositories;

public class PatientRepository : GenericRepository<Patient>, IPatientRepository
{
    public PatientRepository(AppDbContext context) : base(context) { }
    public async Task<Patient?> GetPatientByIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet.AsNoTracking().Include(p => p.User)
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);
    }
}
