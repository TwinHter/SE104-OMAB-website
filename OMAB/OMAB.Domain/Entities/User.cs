using System;
using OMAB.Domain.Enums;

namespace OMAB.Domain.Entities;

public class User
{
    private User() { }

    public User(string email, string fullName, string passwordHash, Gender gender, UserRole userRole, DateTime dateOfBirth)
    {
        Email = email;
        FullName = fullName;
        PasswordHash = passwordHash;
        Gender = gender;
        UserRole = userRole;
        DateOfBirth = dateOfBirth;
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdateProfile(string? fullName, Gender? gender, DateTime? dateOfBirth)
    {
        if (fullName != null) FullName = fullName;
        if (gender != null) Gender = gender.Value;
        if (dateOfBirth != null) DateOfBirth = dateOfBirth.Value;
    }

    public int GetAge()
    {
        var today = DateTime.Today;
        var age = today.Year - DateOfBirth.Year;
        if (DateOfBirth.Date > today.AddYears(-age)) age--;
        return age;
    }

    public int Id { get; private set; }
    public string Email { get; private set; } = null!;
    public string PasswordHash { get; private set; } = null!;
    public string FullName { get; private set; } = null!;
    public DateTime DateOfBirth { get; private set; }
    public Gender Gender { get; private set; } = Gender.Other;
    public UserRole UserRole { get; private set; } = UserRole.Patient;
    public DateTime CreatedAt { get; private set; }
}