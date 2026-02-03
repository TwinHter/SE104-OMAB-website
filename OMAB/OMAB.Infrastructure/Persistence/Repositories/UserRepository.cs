using System;
using Microsoft.EntityFrameworkCore;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;
using OMAB.Domain.Enums;

namespace OMAB.Infrastructure.Persistence.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context) { }

    public async Task<bool> EmailExistsAsync(string email, CancellationToken ct = default)
    {
        return await _dbSet.AnyAsync(u => u.Email == email, ct);
    }

    public Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
    {
        return _dbSet
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email, ct);
    }

    public async Task<IEnumerable<User>> GetByRoleAsync(UserRole role, CancellationToken ct = default)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(u => u.UserRole == role)
            .ToListAsync(ct);
    }
}
