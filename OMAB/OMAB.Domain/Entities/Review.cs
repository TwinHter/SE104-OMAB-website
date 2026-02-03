using System;

namespace OMAB.Domain.Entities;

public class Review
{
    private Review() { }
    public Review(int rating, string? comment, int appointmentId)
    {
        Rating = rating;
        Comment = comment ?? "";
        AppointmentId = appointmentId;
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(int rating, string? comment)
    {
        Rating = rating;
        if (comment != null) Comment = comment;
    }

    public int Id { get; private set; }
    public int AppointmentId { get; private set; }
    public Appointment Appointment { get; private set; } = null!;
    public int Rating { get; private set; }
    public string Comment { get; private set; } = "";
    public DateTime CreatedAt { get; private set; }
}
