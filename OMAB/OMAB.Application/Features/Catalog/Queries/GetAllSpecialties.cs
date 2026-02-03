using AutoMapper;
using MediatR;
using OMAB.Application.Cores;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;

namespace OMAB.Application.Features.Catalog.Queries;

public class GetAllSpecialties
{
    public record Query() : IRequest<Result<List<SpecialtyDto>>>;
    public class Handler(IGenericRepository<Specialty> specialtyRepository, IMapper mapper) : IRequestHandler<Query, Result<List<SpecialtyDto>>>
    {
        public async Task<Result<List<SpecialtyDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var specialties = await specialtyRepository.GetAllAsync(cancellationToken);
            var specialtyDtos = mapper.Map<List<SpecialtyDto>>(specialties);
            return Result<List<SpecialtyDto>>.Success(specialtyDtos);
        }
    }
}
