using System;
using OMAB.Domain.Entities;
using OMAB.Domain.Enums;

namespace OMAB.Application.Features.Appointments.DTOs;

public record AppointmentDetailDto
{
    public int Id { get; set; }
    public ReviewDto? Review { get; set; }
    public PersonDto Patient { get; init; } = null!;
    public PersonDto Doctor { get; init; } = null!;
    public DiseaseDto? Disease { get; init; } = null!;

    public DateTime AppointmentDate { get; init; }
    public DateTime AppointmentEndTime { get; init; }
    public AppointmentStatus Status { get; init; } = AppointmentStatus.Pending;
    public decimal Fee { get; init; }
    public PaymentStatus PaymentStatus { get; init; } = PaymentStatus.Unpaid;
    public string Notes { get; init; } = "";
    public string PatientNotes { get; init; } = "";
}
