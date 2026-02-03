using System;

namespace OMAB.Application.Features.Profiles.DTOs;

public record DoctorSummaryDto
{
    public int UserId { get; init; }
    public string FullName { get; init; } = null!;
    public decimal ConsultationFee { get; init; }
    public decimal Rating { get; init; }
    public int ExperienceYears { get; init; }
    public List<string> Specializations { get; init; } = new();
}
