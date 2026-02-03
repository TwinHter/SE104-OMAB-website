using System;

namespace OMAB.Domain.Entities;

public class DoctorSchedule
{
    public DoctorSchedule() { }
    public DoctorSchedule(DayOfWeek dayOfWeek, TimeSpan startTime, TimeSpan endTime, int doctorId)
    {
        DayOfWeek = dayOfWeek;
        StartTime = startTime;
        EndTime = endTime;
        DoctorId = doctorId;
    }
    public int Id { get; private set; }
    public int DoctorId { get; private set; }
    // public Doctor Doctor { get; private set; } = null!;

    public DayOfWeek DayOfWeek { get; private set; }
    public TimeSpan StartTime { get; private set; }
    public TimeSpan EndTime { get; private set; }
    public int SlotDurationInMinutes { get; private set; } = 30;
}
