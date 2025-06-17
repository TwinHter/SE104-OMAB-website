using Backend.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Core.Interfaces
{
    public interface IDoctorRepository : IGenericRepository<Doctor>
    {
        Task<IEnumerable<Doctor>> GetAllDoctorsWithUserAndReviewsAsync();
        Task<Doctor?> GetDoctorByIdWithUserAndReviewsAsync(string doctorId);
        Task UpdateDoctorAvailabilityAsync(string doctorId, Dictionary<string, List<string>> availability);
    }
}