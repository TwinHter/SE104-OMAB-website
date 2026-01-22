using System;

namespace OMAB.Domain.Entities;

public class Review
{
    private Review() { }
    public Review(int rating, string comment, int appointmentId)
    {
        Rating = rating;
        Comment = comment;
        AppointmentId = appointmentId;
    }

    public void UpdateReview(int? rating, string? comment)
    {
        if (rating != null) Rating = rating.Value;
        if (comment != null) Comment = comment;
    }

    public int Id { get; private set; }
    public int AppointmentId { get; private set; }
    public int Rating { get; private set; }
    public string Comment { get; private set; } = "";
}
