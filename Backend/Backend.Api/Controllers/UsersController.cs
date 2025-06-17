using Microsoft.AspNetCore.Mvc;
using Backend.Api.DTOs;
using Backend.Core.Enums;
using Backend.Core.Interfaces;
using Backend.Core.Models;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserNotificationRepository _userNotificationRepository;

        public UsersController(IUserRepository userRepository, IUserNotificationRepository userNotificationRepository)
        {
            _userRepository = userRepository;
            _userNotificationRepository = userNotificationRepository;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            try
            {
                var user = await _userRepository.GetUserWithDoctorProfileAsync(userId); // Include DoctorProfile
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

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
                    Specialty = user.DoctorProfile?.Specialty,
                    ExperienceYears = user.DoctorProfile?.ExperienceYears
                };

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching user details", error = ex.Message });
            }
        }

        [HttpPatch("{userId}")]
        public async Task<IActionResult> UpdateUser(string userId, [FromBody] UpdateUserDto request)
        {
            if (!ModelState.IsValid)
            {
                Console.WriteLine("ModelState is invalid");
                return BadRequest(ModelState);
            }
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found for update" });
                }

                // Update properties
                user.Name = request.Name ?? user.Name;
                user.Email = request.Email ?? user.Email;
                user.AvatarUrl = request.AvatarUrl ?? user.AvatarUrl;
                user.Phone = request.Phone ?? user.Phone;
                user.Address = request.Address ?? user.Address;
                user.Gender = request.Gender ?? user.Gender;
                if (request.DateOfBirth != null && DateTime.TryParse(request.DateOfBirth, out DateTime dob))
                {
                    user.DateOfBirth = dob;
                }
                user.Description = request.Description ?? user.Description;
                user.BloodType = request.BloodType ?? user.BloodType;
                user.Allergies = request.Allergies ?? user.Allergies;
                user.InsuranceNumber = request.InsuranceNumber ?? user.InsuranceNumber;

                await _userRepository.UpdateAsync(user);

                var updatedUser = await _userRepository.GetUserWithDoctorProfileAsync(userId); // Get with doctor profile for full response
                if (updatedUser == null)
                {
                    return NotFound(new { message = "Updated user not found" });
                }
                var userDto = new UserDto
                {
                    Id = updatedUser.Id,
                    Name = updatedUser.Name,
                    Email = updatedUser.Email,
                    Type = (int)updatedUser.Type,
                    AvatarUrl = updatedUser.AvatarUrl,
                    Phone = updatedUser.Phone,
                    Address = updatedUser.Address,
                    Gender = updatedUser.Gender,
                    DateOfBirth = updatedUser.DateOfBirth?.ToString("yyyy-MM-dd"),
                    Description = updatedUser.Description,
                    BloodType = updatedUser.BloodType,
                    Allergies = updatedUser.Allergies,
                };

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating user", error = ex.Message });
            }
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = $"User with ID {userId} not found." });
                }

                await _userRepository.DeleteAsync(user);

                return Ok(new { message = $"User {userId} successfully deleted (simulated)." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting user", error = ex.Message });
            }
        }

        [HttpGet("role/{role}")]
        public async Task<IActionResult> GetUserByRole(string role) // Giữ nguyên tên endpoint, nhưng logic sẽ khác
        {
            try
            {
                if (!Enum.TryParse(role, true, out UserRole userRole))
                {
                    return BadRequest(new { message = "Invalid user role." });
                }

                // Gọi phương thức mới hoặc đã sửa đổi để lấy danh sách
                var users = await _userRepository.GetUsersByRoleAsync(userRole); // <-- Sử dụng phương thức trả về danh sách

                if (users == null || !users.Any()) // Kiểm tra nếu không có user nào
                {
                    return NotFound(new { message = $"No users found for role {role}." });
                }

                // Chuyển đổi từ List<User> sang List<UserDto>
                var userDtos = users.Select(user => new UserDto
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
                    Specialty = user.DoctorProfile?.Specialty,
                    ExperienceYears = user.DoctorProfile?.ExperienceYears
                }).ToList(); // <-- Chuyển đổi thành List<UserDto>

                return Ok(userDtos); // <-- Trả về List<UserDto>
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching user data", error = ex.Message });
            }
        }

        [HttpGet("{userId}/notifications")]
        public async Task<IActionResult> GetUserNotifications(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(new { message = "User ID is required" });
            }
            try
            {
                var notifications = await _userNotificationRepository.GetNotificationsByUserIdAsync(userId);
                var notificationDtos = notifications.Select(n => new UserNotificationDto
                {
                    Id = n.Id,
                    UserId = n.UserId,
                    Context = n.Context,
                    DateTime = n.DateTime.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    IsRead = n.IsRead,
                    Type = n.Type,
                    RelatedLink = n.RelatedLink
                }).ToList();
                return Ok(notificationDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching notifications", error = ex.Message });
            }
        }

        [HttpPost("{userId}/notifications")]
        public async Task<IActionResult> CreateUserNotification(string userId, [FromBody] CreateUserNotificationDto request)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(new { message = "User ID is required" });
            }
            if (string.IsNullOrEmpty(request.Context))
            {
                return BadRequest(new { message = "Notification context is required" });
            }

            try
            {
                var userExists = await _userRepository.GetByIdAsync(userId);
                if (userExists == null)
                {
                    return NotFound(new { message = $"User with ID {userId} not found." });
                }

                var newNotification = new UserNotification
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = userId,
                    Context = request.Context,
                    DateTime = DateTime.UtcNow,
                    IsRead = false,
                    Type = request.Type ?? "general",
                    RelatedLink = request.RelatedLink
                };

                await _userNotificationRepository.AddAsync(newNotification);

                var responseDto = new UserNotificationDto
                {
                    Id = newNotification.Id,
                    UserId = newNotification.UserId,
                    Context = newNotification.Context,
                    DateTime = newNotification.DateTime.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    IsRead = newNotification.IsRead,
                    Type = newNotification.Type,
                    RelatedLink = newNotification.RelatedLink
                };

                return CreatedAtAction(nameof(GetUserNotifications), new { userId = userId }, responseDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating notification", error = ex.Message });
            }
        }
    }
}