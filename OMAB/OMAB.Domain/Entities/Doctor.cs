using System;

namespace OMAB.Domain.Entities;

public class Doctor
{
    private Doctor() { }
    public Doctor(int experienceYears, decimal consultationFee, bool isActive = true) 
    {
        ExperienceYears = experienceYears;
        ConsultationFee = consultationFee;
        IsActive = isActive;
    }
    public void UpdateInfo(int? experienceYears, decimal? consultationFee, bool? isActive)
    {
        if (experienceYears.HasValue) ExperienceYears = experienceYears.Value;
        if (consultationFee.HasValue) ConsultationFee = consultationFee.Value;
        if (isActive.HasValue) IsActive = isActive.Value;
    }
    public void AddRating(int? newRating)
    {
        if (newRating.HasValue)
        {
            Rating = (Rating * AppointmentCount + newRating.Value) / (AppointmentCount + 1);
            AppointmentCount += 1;
        }
    }
    public void RemoveRating(int? ratingToRemove)
    {
        if (ratingToRemove.HasValue && AppointmentCount > 1)
        {
            Rating = (Rating * AppointmentCount - ratingToRemove.Value) / (AppointmentCount - 1);
            AppointmentCount -= 1;
        }
    }

    public int UserId { get; private set; }
    public int ExperienceYears { get; private set; } = 0;
    public decimal ConsultationFee { get; private set; } = 0;
    public bool IsActive { get; private set; } = true;
    public decimal Rating { get; private set; } = 0;
    public int AppointmentCount { get; private set; } = 0;

    public User User { get; private set; } = null!;
    public ICollection<Specialty> Specialties { get; private set; } = new List<Specialty>();
}
