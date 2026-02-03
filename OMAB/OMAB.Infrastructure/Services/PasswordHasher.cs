using System;
using OMAB.Application.Interfaces;

namespace OMAB.Infrastructure.Persistence.Services;

public class PasswordHasher : IPasswordHasher
{
    public string Hash(string password)
    {
        return password;
    }

    public bool Verify(string password, string hashedPassword)
    {
        return password.Equals(hashedPassword);
    }
}
