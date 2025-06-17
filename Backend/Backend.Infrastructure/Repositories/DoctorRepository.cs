using Microsoft.EntityFrameworkCore;
using Backend.Core.Interfaces;
using Backend.Core.Models;
using Backend.Infrastructure.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq; // Add this for AnyAsync

namespace Backend.Infrastructure.Repositories
{
    public class DoctorRepository : GenericRepository<Doctor>, IDoctorRepository
    {
        public DoctorRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Doctor>> GetAllDoctorsWithUserAndReviewsAsync()
        {
            return await _context.Doctors
                                 .Include(d => d.User) // Include User info for DoctorProfile
                                 .Include(d => d.Reviews)
                                 .ToListAsync();
        }

        public async Task<Doctor?> GetDoctorByIdWithUserAndReviewsAsync(string doctorId)
        {
            return await _context.Doctors
                                 .Include(d => d.User)
                                 .Include(d => d.Reviews)
                                 .FirstOrDefaultAsync(d => d.Id == doctorId);
        }

        public async Task UpdateDoctorAvailabilityAsync(string doctorId, Dictionary<string, List<string>> availability)
        {
            var doctor = await _context.Doctors.FindAsync(doctorId);
            if (doctor != null)
            {
                doctor.Availability = availability; // EF Core will handle JSON update
                await _context.SaveChangesAsync();
            }
        }
    }
}