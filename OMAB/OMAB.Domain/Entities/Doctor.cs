using System;
using OMAB.Domain.Common;

namespace OMAB.Domain.Entities;

public class Doctor
{
    private Doctor() { }
    public Doctor(int id, int experienceYears, decimal consultationFee, bool isActive = true)
    {
        UserId = id;
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

    public void UpdateSpecialties(IEnumerable<int> newSpecialtyIds)
    {
        var currentIds = DoctorSpecialties.Select(ds => ds.SpecialtyId).ToList();

        var toAdd = newSpecialtyIds.Except(currentIds);
        var toRemove = currentIds.Except(newSpecialtyIds);

        foreach (var id in toRemove)
        {
            var existing = DoctorSpecialties.First(ds => ds.SpecialtyId == id);
            DoctorSpecialties.Remove(existing);
        }

        foreach (var id in toAdd)
        {
            DoctorSpecialties.Add(new DoctorSpecialty(UserId, id));
        }
    }


    public void AddReview(int rating)
    {
        decimal totalScore = (Rating * ReviewCount) + rating;
        ReviewCount++;
        Rating = totalScore / ReviewCount;
    }

    public void UpdateReviewScore(int oldRating, int newRating)
    {
        if (oldRating == newRating) return;
        decimal totalScore = (Rating * ReviewCount) - oldRating + newRating;
        Rating = totalScore / ReviewCount;
    }

    public void RemoveReview(int rating)
    {
        if (ReviewCount <= 1)
        {
            Rating = 0;
            ReviewCount = 0;
            return;
        }
        decimal totalScore = (Rating * ReviewCount) - rating;
        ReviewCount--;
        Rating = totalScore / ReviewCount;
    }

    public DomainError? AddSchedule(DayOfWeek day, TimeSpan start, TimeSpan end, int slotDurationInMinutes)
    {
        if (start >= end)
            return new DomainError(false, "Start time must be before End time.");

        if (slotDurationInMinutes <= 0)
            return new DomainError(false, "Slot duration must be greater than 0.");
        if ((end - start).TotalMinutes < slotDurationInMinutes)
            return new DomainError(false, "Time range is too short for the selected slot duration.");
        foreach (var schedule in DoctorSchedules)
        {
            if (!(end <= schedule.StartTime || start >= schedule.EndTime) && schedule.DayOfWeek == day)
            {
                return new DomainError(false, "Schedule overlaps with existing schedule.");
            }
        }

        DoctorSchedules.Add(new DoctorSchedule(day, start, end, slotDurationInMinutes));
        return null;
    }
    public int UserId { get; private set; }
    public int ExperienceYears { get; private set; } = 0;
    public decimal ConsultationFee { get; private set; } = 0;
    public bool IsActive { get; private set; } = true;
    public decimal Rating { get; private set; } = 0;
    public int ReviewCount { get; private set; } = 0;

    public User User { get; private set; } = null!;
    public ICollection<DoctorSpecialty> DoctorSpecialties { get; private set; } = new List<DoctorSpecialty>();
    public ICollection<DoctorSchedule> DoctorSchedules { get; private set; } = new List<DoctorSchedule>();
}
