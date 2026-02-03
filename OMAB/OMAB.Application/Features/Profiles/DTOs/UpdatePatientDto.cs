using System;
using OMAB.Domain.Enums;

namespace OMAB.Application.Features.Profiles.DTOs;

public record UpdatePatientDto
{
    public string? FullName { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? PhoneNumber { get; set; }
    public string? RelativePhoneNumber { get; set; }
    public BloodType? BloodType { get; set; }
    public string? DiseaseHistory { get; set; }
}
