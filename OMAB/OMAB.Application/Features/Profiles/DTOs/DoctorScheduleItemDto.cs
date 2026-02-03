using System;

namespace OMAB.Application.Features.Appointments.DTOs;

public record DoctorScheduleItemDto
{
    public DayOfWeek DayOfWeek { get; init; }
    public TimeSpan StartTime { get; init; }
    public TimeSpan EndTime { get; init; }
}
