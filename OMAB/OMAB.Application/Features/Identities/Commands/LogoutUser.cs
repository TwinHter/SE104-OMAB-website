using System;
using MediatR;
using OMAB.Application.Cores;

namespace OMAB.Application.Features.Identities.Commands;

public class LogoutUser
{
    public record Command() : IRequest<Result<string>>;

    public class Handler : IRequestHandler<Command, Result<string>>
    {
        public Task<Result<string>> Handle(Command request, CancellationToken ct)
        {
            return Task.FromResult(Result<string>.Success("User logged out successfully"));
        }
    }
}
