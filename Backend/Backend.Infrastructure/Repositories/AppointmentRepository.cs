using Microsoft.EntityFrameworkCore;
using Backend.Core.Interfaces;
using Backend.Core.Models;
using Backend.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Infrastructure.Repositories
{
    public class AppointmentRepository : GenericRepository<Appointment>, IAppointmentRepository
    {
        public AppointmentRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Appointment>> GetAllAppointmentsAsync()
        {
            return await _context.Appointments
                                 .Include(a => a.Doctor)
                                 .Include(a => a.Patient)
                                 .Include(a => a.Prescription)
                                 .Include(a => a.PatientReview)
                                 .ToListAsync();
        }

        public async Task<Appointment?> GetAppointmentDetailsAsync(string id)
        {
            return await _context.Appointments
                                 .Include(a => a.Doctor)
                                 .Include(a => a.Patient)
                                 .Include(a => a.Prescription)
                                 .Include(a => a.PatientReview)
                                 .FirstOrDefaultAsync(a => a.Id == id);
        }
    }
}