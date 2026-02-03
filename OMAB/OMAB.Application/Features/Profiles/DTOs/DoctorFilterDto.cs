using System;

namespace OMAB.Application.Features.Profiles.DTOs;

public record DoctorFilterDto
{
    public int? SpecialtyId { get; set; }
    public int? MinimumExperience { get; set; } = 0;
    public int? MinimumRating { get; set; } = 0;
    public bool? IsAvailable { get; set; }
    public int? MaximumConsultationFee { get; set; } = int.MaxValue;
    public bool SortByRatingDesc { get; set; } = false;
}
