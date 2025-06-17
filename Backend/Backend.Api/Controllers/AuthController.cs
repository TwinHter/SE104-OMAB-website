using Microsoft.AspNetCore.Mvc;
using Backend.Api.DTOs;
using Backend.Core.Enums;
using Backend.Core.Interfaces;
using Backend.Core.Models;
using Backend.Core.Services;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly AuthService _authService; // Use the simplified AuthService

        public AuthController(IUserRepository userRepository, AuthService authService)
        {
            _userRepository = userRepository;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request payload." });
            }

            try
            {
                // MÔ PHỎNG: Tìm người dùng theo email và vai trò.
                // KHÔNG CÓ XÁC THỰC MẬT KHẨU THỰC TẾ TRONG CHẾ ĐỘ NÀY.
                var user = await _authService.ValidateUser(request.Email, request.Role);

                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid credentials or role mismatch" });
                }

                // Trả về thông tin người dùng (không có dữ liệu nhạy cảm như password hash)
                var userDto = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Type = (int)user.Type,
                    AvatarUrl = user.AvatarUrl,
                    Phone = user.Phone,
                    Address = user.Address,
                    Gender = user.Gender,
                    DateOfBirth = user.DateOfBirth?.ToString("yyyy-MM-dd"),
                    Description = user.Description,
                    BloodType = user.BloodType,
                    Allergies = user.Allergies,
                    InsuranceNumber = user.InsuranceNumber,
                    Specialty = user.DoctorProfile?.Specialty, // Bao gồm thông tin bác sĩ nếu có
                    ExperienceYears = user.DoctorProfile?.ExperienceYears
                };

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error during login", error = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request payload." });
            }

            if (request.Role == UserRole.Admin)
            {
                return StatusCode(403, new { message = "Admin registration is not allowed via this endpoint." });
            }

            try
            {
                var existingUser = await _userRepository.GetUserByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    return Conflict(new { message = "User with this email already exists." });
                }

                var newUser = await _authService.RegisterUser(request.Name, request.Email, request.Password, request.Role);

                // If the new user is a doctor, create an associated DoctorProfile
                if (newUser.Type == UserRole.Doctor)
                {
                    var newDoctorProfile = new Doctor
                    {
                        Id = newUser.Id, // FK to User
                        Specialty = "General Practitioner", // Default specialty
                        ConsultationFee = 200000, // Default fee
                        ExperienceYears = 0,
                        Location = "Not specified",
                        Availability = new Dictionary<string, List<string>>()
                    };
                    await _userRepository.AddDoctorProfileAsync(newDoctorProfile);
                }

                var userDto = new UserDto
                {
                    Id = newUser.Id,
                    Name = newUser.Name,
                    Email = newUser.Email,
                    Type = (int)newUser.Type,
                    AvatarUrl = newUser.AvatarUrl ?? $"https://placehold.co/100x100.png?text={newUser.Name[0]}"
                };

                return CreatedAtAction(nameof(Login), userDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error during registration", error = ex.Message });
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "Logged out successfully" });
        }
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request payload." });
            }

            try
            {
                var result = await _authService.ChangePassword(request.UserId, request.CurrentPassword, request.NewPassword);
                if (!result)
                {
                    return BadRequest(new { message = "Error changing password." });
                }

                return Ok(new { message = "Password changed successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error during password change", error = ex.Message });
            }
        }
    }

    // change password endpoint
}