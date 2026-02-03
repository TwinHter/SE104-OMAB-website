using System;

namespace OMAB.Application.Features.Catalog;

public record DiseaseDto(int Id, string Icd10Code, string Name);

public record MedicineDto(int Id, string Name, string Unit);

public record SpecialtyDto(int Id, string Name);
