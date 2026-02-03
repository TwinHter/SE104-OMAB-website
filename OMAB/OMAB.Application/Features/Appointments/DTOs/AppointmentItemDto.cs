using System;
using OMAB.Domain.Enums;

namespace OMAB.Application.Features.Appointments.DTOs;

public record AppointmentItemDto
{
    public int Id { get; init; }
    public PersonDto Patient { get; init; } = null!;
    public PersonDto Doctor { get; init; } = null!;

    public DateTime AppointmentDate { get; init; }
    public DateTime AppointmentEndTime { get; init; }
    public AppointmentStatus Status { get; init; } = AppointmentStatus.Pending;
    public PaymentStatus PaymentStatus { get; init; } = PaymentStatus.Unpaid;
    public DateTime CreatedAt { get; init; }
}
