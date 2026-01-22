using System;
using OMAB.Domain.Enums;

namespace OMAB.Domain.Entities;

public class User
{
    private User() { }

    public User(string email, string fullName, string passwordHash, Gender gender, UserRole userRole)
    {
        Email = email;
        FullName = fullName;
        PasswordHash = passwordHash;
        Gender = gender;
        UserRole = userRole;
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdateProfile(string fullName, Gender gender)
    {
        FullName = fullName;
        Gender = gender;
    }

    public int Id { get; private set; }
    public string Email { get; private set; } = null!;
    public string PasswordHash { get; private set; } = null!;
    public string FullName { get; private set; } = null!;
    public Gender Gender { get; private set; } = Gender.Other;
    public UserRole UserRole { get; private set; } = UserRole.Patient;
    public DateTime CreatedAt { get; private set; }

    public Doctor? Doctor { get; private set; }
    public Patient? Patient { get; private set; }
}