using System;

namespace OMAB.Application.Features.Appointments.DTOs;

public record PersonDto(int Id, string Name);
public record DiseaseDto(int Id, string Name);
public record PrescriptionItem(int? Id, int MedicineId, string Dosage, string Frequency);