using System;
using OMAB.Domain.Enums;

namespace OMAB.Application.Features.Appointments.DTOs;

public record UpdateAppointmentByDoctorDto
{
    public int? DiseaseId { get; set; }
    public DateTime? AppointmentDate { get; set; }
    public DateTime? AppointmentEndTime { get; set; }
    public AppointmentStatus? Status { get; set; }
    public string? Notes { get; set; }
    public decimal? Fee { get; set; }
}
