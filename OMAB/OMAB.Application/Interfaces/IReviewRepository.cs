using System;
using OMAB.Application.Features.Appointments.DTOs;
using OMAB.Domain.Entities;

namespace OMAB.Application.Interfaces;

public interface IReviewRepository : IGenericRepository<Review>
{
    Task<List<ReviewDto>> GetReviewsByDoctorIdAsync(int doctorId, CancellationToken cancellationToken);
}
