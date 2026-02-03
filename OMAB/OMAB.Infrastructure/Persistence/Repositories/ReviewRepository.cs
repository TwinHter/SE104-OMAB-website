using Microsoft.EntityFrameworkCore;
using OMAB.Application.Features.Appointments.DTOs;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;

namespace OMAB.Infrastructure.Persistence.Repositories;

public class ReviewRepository : GenericRepository<Review>, IReviewRepository
{
    public ReviewRepository(AppDbContext context) : base(context) { }

    // Author perspective: This is not a good design.
    public async Task<List<ReviewDto>> GetReviewsByDoctorIdAsync(int doctorId, CancellationToken ct)
    {
        return await _context.Appointments
            .AsNoTracking()
            .Where(a => a.DoctorId == doctorId)
            .Where(a => a.Review != null)
            .Select(a => new ReviewDto(
                a.Review!.Id,
                a.Review.Rating,
                a.Review.Comment,
                a.Patient.User.FullName,
                a.AppointmentDate
            ))
            .ToListAsync(ct);
    }
}