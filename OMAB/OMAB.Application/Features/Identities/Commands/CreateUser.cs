using System;
using FluentValidation;
using MediatR;
using OMAB.Application.Cores;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;
using OMAB.Domain.Enums;

namespace OMAB.Application.Features.Identities;

public class CreateUser
{
    public record Command(string Email, string Password, UserRole Role) : IRequest<Result<int>>;

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
            RuleFor(x => x.Role).IsInEnum();
        }
    }

    public class Handler(IUserRepository userRepository, IUnitOfWork unitOfWork, IPasswordHasher passwordHasher) : IRequestHandler<Command, Result<int>>
    {
        public async Task<Result<int>> Handle(Command request, CancellationToken ct)
        {
            if (await userRepository.EmailExistsAsync(request.Email, ct))
            {
                return Result<int>.Failure("Email already exists.", statusCode: 409);
            }

            var user = new User(
                email: request.Email,
                passwordHash: passwordHasher.Hash(request.Password),
                userRole: request.Role
            );

            await userRepository.AddAsync(user, ct);
            var result = await unitOfWork.SaveChangesAsync(ct);
            if (result <= 0) return Result<int>.Failure("Failed to create user.", 500);

            return Result<int>.Success(user.Id);
        }
    }
}
