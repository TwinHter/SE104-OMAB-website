using AutoMapper;
using MediatR;
using OMAB.Application.Cores;
using OMAB.Application.Features.Profiles.DTOs;
using OMAB.Application.Interfaces;

namespace OMAB.Application.Features.Profiles.Queries;

public class GetDoctorsByFilter
{
    public record Query(DoctorFilterDto Filter) : IRequest<Result<List<DoctorSummaryDto>>>;

    public class Handler(IDoctorRepository doctorRepository, IMapper mapper)
        : IRequestHandler<Query, Result<List<DoctorSummaryDto>>>
    {
        public async Task<Result<List<DoctorSummaryDto>>> Handle(Query request, CancellationToken ct)
        {
            var doctorFilter = mapper.Map<DoctorFilter>(request.Filter);
            var doctors = await doctorRepository.GetFilteredDoctorsAsync(doctorFilter, ct);
            if(request.Filter.SortByRatingDesc)
            {
                doctors = doctors.OrderByDescending(d => d.Rating).ToList();
            }
            
            var doctorDtos = mapper.Map<List<DoctorSummaryDto>>(doctors);
            return Result<List<DoctorSummaryDto>>.Success(doctorDtos);
        }
    }
}
