using System;
using OMAB.Domain.Entities;
using OMAB.Domain.Enums;

namespace OMAB.Application.Interfaces;

public interface IUserRepository : IGenericRepository<User>
{
    Task<IEnumerable<User>> GetByRoleAsync(UserRole role, CancellationToken ct = default);
    Task<bool> EmailExistsAsync(string email, CancellationToken ct = default);
}
