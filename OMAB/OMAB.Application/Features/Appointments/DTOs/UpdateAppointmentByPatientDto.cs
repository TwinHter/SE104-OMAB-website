using System;
using OMAB.Domain.Enums;

namespace OMAB.Application.Features.Appointments.DTOs;

public record UpdateAppointmentByPatientDto
{
    public string? PatientNotes { get; set; }
    // public PaymentStatus? PaymentStatus { get; set; }
}
