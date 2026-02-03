using System;
using MediatR;
using OMAB.Application.Cores;
using OMAB.Application.Interfaces;

namespace OMAB.Application.Features.Identities.Commands;

public class LoginUser
{
    public record Command(string Email, string Password) : IRequest<Result<int>>;

    public class Handler(IUserRepository userRepo, IPasswordHasher hasher)
        : IRequestHandler<Command, Result<int>>
    {
        public async Task<Result<int>> Handle(Command request, CancellationToken ct)
        {
            var user = await userRepo.GetByEmailAsync(request.Email, ct);
            if (user == null)
                return Result<int>.Failure("Invalid credentials", 400);

            if (!hasher.Verify(request.Password, user.PasswordHash))
                return Result<int>.Failure("Invalid credentials", 400);

            return Result<int>.Success(user.Id);
        }
    }
}
