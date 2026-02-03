using System;
using OMAB.Domain.Entities;

namespace OMAB.Application.Features.Appointments.DTOs;

public record PrescriptionDto
{
    public PersonDto Patient { get; init; } = null!;
    public DiseaseDto Disease { get; init; } = null!;
    public List<PrescriptionItem> Items { get; init; } = null!;
}
