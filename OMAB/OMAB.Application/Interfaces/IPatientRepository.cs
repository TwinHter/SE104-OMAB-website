using System;
using OMAB.Domain.Entities;

namespace OMAB.Application.Interfaces;

public interface IPatientRepository : IGenericRepository<Patient>
{
    Task<Patient?> GetPatientByIdAsync(int userId, CancellationToken cancellationToken = default);
}
