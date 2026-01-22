using Backend.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Core.Interfaces
{
    public interface IAppointmentRepository : IGenericRepository<Appointment>
    {
        Task<IEnumerable<Appointment>> GetAllAppointmentsAsync();
        Task<Appointment?> GetAppointmentDetailsAsync(string id);
    }
}