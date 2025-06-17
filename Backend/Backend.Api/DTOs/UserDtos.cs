using Backend.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace Backend.Api.DTOs
{
    // For Login request
    public class LoginRequestDto
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; } // Not checked, but required by frontend
        [Required]
        public UserRole Role { get; set; }
    }

    // For Register request
    public class RegisterRequestDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; } // Not stored, but required by frontend
        [Required]
        public UserRole Role { get; set; }
    }

    public class ChangePasswordRequestDto
    {
        [Required(ErrorMessage = "User ID is required.")]
        public string UserId { get; set; } // Cần biết người dùng nào muốn đổi mật khẩu

        [Required(ErrorMessage = "Current password is required.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string CurrentPassword { get; set; }

        [Required(ErrorMessage = "New password is required.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "New password must be at least 6 characters long.")]
        public string NewPassword { get; set; }

        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmNewPassword { get; set; }
    }
    // For User response (Login, Register, Get User)
    public class UserDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int Type { get; set; } // 0: Admin, 1: Doctor, 2: Patient
        public string? AvatarUrl { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Gender { get; set; }
        public string? DateOfBirth { get; set; } // YYYY-MM-DD
        public string? Description { get; set; }
        public string? BloodType { get; set; }
        public string? Allergies { get; set; }
        public string? InsuranceNumber { get; set; }
        public string? Specialty { get; set; } // Only for doctors
        public int? ExperienceYears { get; set; } // Only for doctors
    }

    // For PATCH /api/users/{userId} request
    public class UpdateUserDto
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Gender { get; set; }
        public string? DateOfBirth { get; set; }
        public string? Description { get; set; }
        public string? BloodType { get; set; }
        public string? Allergies { get; set; }
        public string? InsuranceNumber { get; set; }
    }

    // For GET /api/users/{userId}/notifications response
    public class UserNotificationDto
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string Context { get; set; }
        public string DateTime { get; set; } // ISO string
        public bool IsRead { get; set; }
        public string? Type { get; set; }
        public string? RelatedLink { get; set; }
    }

    // For POST /api/users/{userId}/notifications request
    public class CreateUserNotificationDto
    {
        [Required]
        public string Context { get; set; }
        public string? Type { get; set; }
        public string? RelatedLink { get; set; }
    }
}