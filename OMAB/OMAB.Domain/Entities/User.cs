using System;
using OMAB.Domain.Enums;

namespace OMAB.Domain.Entities;

public class User
{
    private User() { }

    public User(string email, string passwordHash, UserRole userRole)
    {
        Email = email;
        PasswordHash = passwordHash;
        UserRole = userRole;
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdatePersonalInfo(string? fullName = null, Gender? gender = null, string? phoneNumber = null, DateTime? dateOfBirth = null)
    {
        if (fullName != null) FullName = fullName;
        if (gender.HasValue) Gender = gender.Value;
        if (phoneNumber != null) PhoneNumber = phoneNumber;
        if (dateOfBirth.HasValue) DateOfBirth = dateOfBirth.Value;
    }

    public void ChangePassword(string newPasswordHash)
    {
        PasswordHash = newPasswordHash;
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
    public string PhoneNumber { get; private set; } = null!;
    public DateTime CreatedAt { get; private set; }

    public Doctor? Doctor { get; private set; }
    public Patient? Patient { get; private set; }
}