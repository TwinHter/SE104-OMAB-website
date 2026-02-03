using System;
using AutoMapper;
using OMAB.Application.Features.Catalog;
using OMAB.Domain.Entities;

namespace OMAB.Application.Cores;

public class CatalogMappingProfile : Profile
{
    public CatalogMappingProfile()
    {
        CreateMap<Disease, DiseaseDto>();

        CreateMap<Medicine, MedicineDto>();

        CreateMap<Specialty, SpecialtyDto>();
    }
}
