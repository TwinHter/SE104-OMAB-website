using Microsoft.EntityFrameworkCore;
using Backend.Core.Enums;
using Backend.Core.Interfaces;
using Backend.Core.Models;
using Backend.Infrastructure.Data;
using System.Threading.Tasks;
using System.Linq;

namespace Backend.Infrastructure.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context) { }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetUserByRoleAsync(UserRole role)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Type == role);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetUserWithDoctorProfileAsync(string userId)
        {
            return await _context.Users
                                 .Include(u => u.DoctorProfile)
                                 .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task AddDoctorProfileAsync(Doctor doctor)
        {
            await _context.Doctors.AddAsync(doctor);
            await _context.SaveChangesAsync();
        }

        public override async Task DeleteAsync(User entity)
        {
            // If the user is a doctor, delete their DoctorProfile first
            if (entity.Type == UserRole.Doctor)
            {
                var doctorProfile = await _context.Doctors.FirstOrDefaultAsync(d => d.Id == entity.Id);
                if (doctorProfile != null)
                {
                    _context.Doctors.Remove(doctorProfile);
                }
            }
            // All other cascading deletions (notifications, relatives, appointments)
            // are handled by OnDelete(DeleteBehavior.Cascade) in AppDbContext
            _context.Users.Remove(entity);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<User>> GetUsersByRoleAsync(UserRole role)
        {
            // Logic truy vấn LINQ để lấy TẤT CẢ user có User.Type == role
            return await _context.Users
                                 .Where(u => u.Type == role)
                                 .Include(u => u.DoctorProfile) // Bao gồm DoctorProfile nếu cần các thuộc tính đặc biệt của bác sĩ
                                 .ToListAsync();
        }
    }
}