using System;
using AutoMapper;
using MediatR;
using OMAB.Application.Cores;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;

namespace OMAB.Application.Features.Catalog.Queries;

public class GetAllDiseases
{
    public record Query() : IRequest<Result<IEnumerable<DiseaseDto>>>;

    public class Handler(IMapper mapper, IGenericRepository<Disease> diseaseRepository) : IRequestHandler<Query, Result<IEnumerable<DiseaseDto>>>
    {
        public async Task<Result<IEnumerable<DiseaseDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var diseases = await diseaseRepository.GetAllAsync(cancellationToken);
            var diseaseDtos = mapper.Map<IEnumerable<DiseaseDto>>(diseases);
            return Result<IEnumerable<DiseaseDto>>.Success(diseaseDtos);
        }
    } 
}
