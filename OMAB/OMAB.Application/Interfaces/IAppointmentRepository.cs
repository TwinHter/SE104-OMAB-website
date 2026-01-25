using System;
using OMAB.Application.Models;
using OMAB.Domain.Entities;

namespace OMAB.Application.Interfaces;

public interface IAppointmentRepository : IGenericRepository<Appointment>
{
    Task<IEnumerable<Appointment>> GetByFilter(AppointmentFilter filter, CancellationToken ct = default);
    Task<Appointment
}
