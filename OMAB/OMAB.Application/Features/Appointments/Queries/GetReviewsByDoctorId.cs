using System;
using MediatR;
using OMAB.Application.Cores;
using OMAB.Application.Features.Appointments.DTOs;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;

namespace OMAB.Application.Features.Appointments.Queries;

public class GetReviewByDoctorId
{
    public record Query(int DoctorId) : IRequest<Result<List<ReviewDto>>>;

    public class Handler(IReviewRepository reviewRepository) : IRequestHandler<Query, Result<List<ReviewDto>>>
    {
        public async Task<Result<List<ReviewDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var reviews = await reviewRepository.GetReviewsByDoctorIdAsync(request.DoctorId, cancellationToken);
            return Result<List<ReviewDto>>.Success(reviews);
        }
    }
}
