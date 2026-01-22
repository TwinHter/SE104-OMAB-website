using Backend.Core.Models;
using Backend.Core.Enums;
using System.Threading.Tasks;

namespace Backend.Core.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByRoleAsync(UserRole role);
        Task<User?> GetUserWithDoctorProfileAsync(string userId);
        Task AddDoctorProfileAsync(Doctor doctor); // For linking Doctor role to DoctorProfile
        Task<User?> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetUsersByRoleAsync(UserRole role);
    }
}