using System;

namespace OMAB.Application.Features.Profiles.DTOs;

public record UpdateDoctorDto
{
    public string? FullName { get; set; }
    public decimal? ConsultationFee { get; set; }
    public int? ExperienceYears { get; set; } = 0;
    public DateTime? DateOfBirth { get; set; }
    public string? PhoneNumber { get; set; }
    public bool? IsActive { get; set; }
    // public List<int>? SpecialtyIds { get; set; }
}
