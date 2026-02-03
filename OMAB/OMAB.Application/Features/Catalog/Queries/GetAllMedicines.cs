using System;
using AutoMapper;
using MediatR;
using OMAB.Application.Cores;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;

namespace OMAB.Application.Features.Catalog.Queries;

public class GetAllMedicines
{
    public record Query() : IRequest<Result<List<MedicineDto>>>;
    public class Handler(IGenericRepository<Medicine> medicineRepository, IMapper mapper) : IRequestHandler<Query, Result<List<MedicineDto>>>
    {
        public async Task<Result<List<MedicineDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var medicines = await medicineRepository.GetAllAsync(cancellationToken);
            var medicineDtos = mapper.Map<List<MedicineDto>>(medicines);
            return Result<List<MedicineDto>>.Success(medicineDtos);
        }
    }
}
