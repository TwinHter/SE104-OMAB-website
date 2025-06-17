using Microsoft.AspNetCore.Mvc;
using Backend.Api.DTOs;
using Backend.Core.Interfaces;
using Backend.Core.Models;
using Backend.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Core.Services;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/doctors")]
    public class DoctorsController : ControllerBase
    {

        private readonly IDoctorRepository _doctorRepository;
        private readonly IUserRepository _userRepository;
        private readonly IGenericRepository<DoctorReview> _doctorReviewRepository;
        private readonly AuthService _authService; // Use the simplified AuthService

        public DoctorsController(IDoctorRepository doctorRepository, IUserRepository userRepository, IGenericRepository<DoctorReview> doctorReviewRepository, AuthService authService)
        {
            _doctorRepository = doctorRepository;
            _userRepository = userRepository;
            _doctorReviewRepository = doctorReviewRepository;
            _authService = authService;
        }

        private DoctorResponseDto MapDoctorToDto(Doctor doctor)
        {
            return new DoctorResponseDto
            {
                Id = doctor.Id,
                Specialty = doctor.Specialty,
                ConsultationFee = doctor.ConsultationFee,
                ExperienceYears = doctor.ExperienceYears,
                Location = doctor.Location,
                AvgRating = doctor.AvgRating,
                TotalAppointments = doctor.TotalAppointments,
                Name = doctor.User?.Name,
                Email = doctor.User?.Email,
                Phone = doctor.User?.Phone,
                AvatarUrl = doctor.User?.AvatarUrl
            };
        }


        [HttpGet]
        public async Task<IActionResult> GetDoctors()
        {
            try
            {
                var doctors = await _doctorRepository.GetAllDoctorsWithUserAndReviewsAsync();
                var doctorDtos = doctors.Select(d => new DoctorProfileDto
                {
                    Id = d.Id,
                    Name = d.User.Name, // From User
                    Email = d.User.Email, // From User
                    Specialty = d.Specialty,
                    AvatarUrl = d.User.AvatarUrl ?? "https://placehold.co/120x120.png",
                    ConsultationFee = d.ConsultationFee,
                    ExperienceYears = d.ExperienceYears,
                    Location = d.Location,
                    Availability = d.Availability,
                    Reviews = d.Reviews?.Select(r => new DoctorReviewDto
                    {
                        Id = r.Id,
                        PatientName = r.PatientName,
                        Rating = r.Rating,
                        Comment = r.Comment,
                        Date = r.Date.ToString("yyyy-MM-ddTHH:mm:ssZ")
                    }).ToList(),
                    Phone = d.User.Phone,
                    Gender = d.User.Gender,
                    DateOfBirth = d.User.DateOfBirth?.ToString("yyyy-MM-dd"),
                    Description = d.User.Description,
                    Avg_Rating = d.Reviews?.Any() == true ? (decimal)d.Reviews.Average(r => r.Rating) : 0,
                    Total_Appointments = d.TotalAppointments
                }).ToList();

                return Ok(doctorDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching doctors", error = ex.Message });
            }
        }

        [HttpGet("{doctorId}")]
        public async Task<IActionResult> GetDoctorById(string doctorId)
        {
            try
            {
                var doctor = await _doctorRepository.GetDoctorByIdWithUserAndReviewsAsync(doctorId);
                if (doctor == null)
                {
                    return NotFound(new { message = $"Doctor with ID {doctorId} not found." });
                }

                var doctorDto = new DoctorProfileDto
                {
                    Id = doctor.Id,
                    Name = doctor.User.Name,
                    Email = doctor.User.Email,
                    Specialty = doctor.Specialty,
                    AvatarUrl = doctor.User.AvatarUrl ?? "https://placehold.co/120x120.png",
                    ConsultationFee = doctor.ConsultationFee,
                    ExperienceYears = doctor.ExperienceYears,
                    Location = doctor.Location,
                    Availability = doctor.Availability,
                    Reviews = doctor.Reviews?.Select(r => new DoctorReviewDto
                    {
                        Id = r.Id,
                        PatientName = r.PatientName,
                        Rating = r.Rating,
                        Comment = r.Comment,
                        Date = r.Date.ToString("yyyy-MM-ddTHH:mm:ssZ")
                    }).ToList(),
                    Phone = doctor.User.Phone,
                    Gender = doctor.User.Gender,
                    DateOfBirth = doctor.User.DateOfBirth?.ToString("yyyy-MM-dd"),
                    Description = doctor.User.Description,
                    Avg_Rating = doctor.Reviews?.Any() == true ? (decimal)doctor.Reviews.Average(r => r.Rating) : 0,
                    Total_Appointments = doctor.TotalAppointments
                };

                return Ok(doctorDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching doctor details", error = ex.Message });
            }
        }

        [HttpPatch("{doctorId}/availability")]
        public async Task<IActionResult> UpdateDoctorAvailability(string doctorId, [FromBody] UpdateDoctorAvailabilityDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var doctor = await _doctorRepository.GetByIdAsync(doctorId);
                if (doctor == null)
                {
                    return NotFound(new { message = "Doctor not found" });
                }

                // Update the specific date's availability
                if (!doctor.Availability.ContainsKey(request.Date))
                {
                    doctor.Availability[request.Date] = new List<string>();
                }

                if (request.Status.ToLower() == "available")
                {
                    foreach (var timeSlot in request.TimeSlots)
                    {
                        if (!doctor.Availability[request.Date].Contains(timeSlot))
                        {
                            doctor.Availability[request.Date].Add(timeSlot);
                        }
                    }
                    doctor.Availability[request.Date] = doctor.Availability[request.Date].OrderBy(t => t).ToList(); // Sort for consistency
                }
                else if (request.Status.ToLower() == "busy")
                {
                    foreach (var timeSlot in request.TimeSlots)
                    {
                        doctor.Availability[request.Date].Remove(timeSlot);
                    }
                }

                await _doctorRepository.UpdateDoctorAvailabilityAsync(doctorId, doctor.Availability);

                return Ok(new { availability = doctor.Availability });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating availability", error = ex.Message });
            }
        }

        [HttpPost("{doctorId}/reviews")]
        public async Task<IActionResult> AddDoctorReview(string doctorId, [FromBody] CreateDoctorReviewDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var doctor = await _doctorRepository.GetByIdAsync(doctorId);
                if (doctor == null)
                {
                    return NotFound(new { message = "Doctor not found" });
                }

                var newReview = new DoctorReview
                {
                    Id = Guid.NewGuid().ToString(),
                    DoctorId = doctorId,
                    PatientName = request.PatientName,
                    Rating = request.Rating,
                    Comment = request.Comment,
                    Date = DateTime.UtcNow // Use UTC for consistency
                };

                await _doctorReviewRepository.AddAsync(newReview);

                // Update average rating and total appointments for the doctor (optional, can be done async or on query)
                var updatedDoctor = await _doctorRepository.GetDoctorByIdWithUserAndReviewsAsync(doctorId);
                if (updatedDoctor?.Reviews?.Any() == true)
                {
                    updatedDoctor.AvgRating = (decimal)updatedDoctor.Reviews.Average(r => r.Rating);
                    updatedDoctor.TotalAppointments = (updatedDoctor.TotalAppointments ?? 0) + 1; // Assuming a review implies an appointment
                    await _doctorRepository.UpdateAsync(updatedDoctor);
                }


                var responseDto = new DoctorReviewDto
                {
                    Id = newReview.Id,
                    PatientName = newReview.PatientName,
                    Rating = newReview.Rating,
                    Comment = newReview.Comment,
                    Date = newReview.Date.ToString("yyyy-MM-ddTHH:mm:ssZ")
                };

                return CreatedAtAction(nameof(GetDoctorById), new { doctorId = doctorId }, responseDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error submitting review", error = ex.Message });
            }
        }

        [HttpGet("{doctorId}/reviews")]
        public async Task<IActionResult> GetDoctorReviews(string doctorId)
        {
            try
            {
                var allReviews = await _doctorReviewRepository.GetAllAsync();
                var reviews = allReviews.Where(r => r.DoctorId == doctorId).ToList();

                var reviewDtos = reviews.Select(r => new DoctorReviewDto
                {
                    Id = r.Id,
                    PatientName = r.PatientName,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    Date = r.Date.ToString("yyyy-MM-ddTHH:mm:ssZ")
                }).ToList();

                return Ok(reviewDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching reviews", error = ex.Message });
            }
        }

        // [HttpPost("create")]
        // public async Task<IActionResult> CreateDoctor([FromBody] CreateDoctorDto request)
        // {
        //     if (!ModelState.IsValid)
        //     {
        //         return BadRequest(ModelState);
        //     }

        //     try
        //     {
        //         // Kiểm tra email đã tồn tại (tùy yêu cầu)
        //         var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        //         if (existingUser != null)
        //         {
        //             return Conflict(new { message = "Email already exists" });
        //         }
        //         var user = new User
        //         {
        //             Id = Guid.NewGuid().ToString(),
        //             Name = request.Name,
        //             PasswordHash = request.Password,
        //             Email = request.Email,
        //             Phone = request.Phone,
        //             AvatarUrl = request.AvatarUrl,
        //             Salt = Guid.NewGuid().ToString(),
        //         };

        //         await _userRepository.AddAsync(user);

        //         var doctor = new Doctor
        //         {
        //             Id = Guid.NewGuid().ToString(),
        //             Specialty = request.Specialty ?? "Unknown Specialty",
        //             ConsultationFee = request.ConsultationFee,
        //             ExperienceYears = request.ExperienceYears,
        //             Location = request.Location ?? "Unknown Location",
        //             User = user,
        //             AvgRating = 0,
        //             TotalAppointments = 0
        //         };

        //         await _doctorRepository.AddAsync(doctor);

        //         // Chuyển đổi sang DTO để trả về
        //         var doctorDto = MapDoctorToDto(doctor);

        //         return CreatedAtAction(nameof(GetDoctorById), new { doctorId = doctor.Id }, doctorDto);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { message = "Error creating doctor", error = ex.Message });
        //     }
        // }

        [HttpPost("create")]
        public async Task<IActionResult> CreateDoctor([FromBody] CreateDoctorDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request payload." });
            }

            try
            {
                // Check if email already exists
                var existingUser = await _userRepository.GetUserByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    return Conflict(new { message = "User with this email already exists." });
                }

                // Tạo user với role là Doctor
                var newUser = await _authService.RegisterUser(
                    request.Name,
                    request.Email,
                    request.Password,
                    UserRole.Doctor
                );

                // Cập nhật thêm thông tin user
                newUser.Phone = request.Phone ?? "Not specified";
                newUser.AvatarUrl = request.AvatarUrl ?? $"https://placehold.co/100x100.png?text={newUser.Name[0]}";
                newUser.Gender = request.Gender ?? "Not specified";

                if (request.DateOfBirth.HasValue)
                {
                    newUser.DateOfBirth = request.DateOfBirth.Value;
                }

                await _userRepository.UpdateAsync(newUser);

                // Tạo hồ sơ bác sĩ
                var doctorProfile = new Doctor
                {
                    Id = newUser.Id,
                    Specialty = request.Specialty ?? "General Practitioner",
                    ExperienceYears = request.ExperienceYears,
                    ConsultationFee = request.ConsultationFee,
                    Location = request.Address ?? "Not specified",
                    Availability = new Dictionary<string, List<string>>(),
                    AvgRating = 0,
                    TotalAppointments = 0
                };

                await _userRepository.AddDoctorProfileAsync(doctorProfile);

                // Trả về kết quả
                var doctorDto = new UserDto
                {
                    Id = newUser.Id,
                    Name = newUser.Name,
                    Email = newUser.Email,
                    Type = (int)newUser.Type,
                    AvatarUrl = newUser.AvatarUrl ?? $"https://placehold.co/100x100.png?text={newUser.Name[0]}"
                };

                return CreatedAtAction(nameof(CreateDoctor), new { id = newUser.Id }, doctorDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating doctor", error = ex.Message });
            }
        }


        [HttpPost("update/{doctorId}")]
        public async Task<IActionResult> UpdateDoctor(string doctorId, [FromBody] UpdateDoctorProfileDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Lấy doctor và bao gồm luôn thông tin user
                var doctor = await _doctorRepository.GetByIdAsync(doctorId);

                if (doctor == null)
                    return NotFound(new { message = "Doctor not found" });

                var user = await _userRepository.GetByIdAsync(doctorId);

                // Cập nhật thông tin User
                user.Name = request.Name ?? user.Name;
                user.Email = request.Email ?? user.Email;
                user.AvatarUrl = request.AvatarUrl ?? user.AvatarUrl;
                user.Phone = request.Phone ?? user.Phone;
                user.Address = request.Address ?? user.Address;
                user.Gender = request.Gender ?? user.Gender;
                user.Description = request.Description ?? user.Description;
                user.BloodType = request.BloodType ?? user.BloodType;
                user.Allergies = request.Allergies ?? user.Allergies;
                user.InsuranceNumber = request.InsuranceNumber ?? user.InsuranceNumber;

                if (!string.IsNullOrEmpty(request.DateOfBirth) &&
                    DateTime.TryParse(request.DateOfBirth, out var dob))
                {
                    user.DateOfBirth = dob;
                }

                // Cập nhật mật khẩu (nếu bạn hash lại ở service thì thêm logic tại đây)
                if (!string.IsNullOrEmpty(request.Password))
                {
                    // TODO: Hash password lại
                    user.PasswordHash = request.Password; // Demo only, KHÔNG nên làm thế này nếu chưa hash
                }

                // Cập nhật thông tin Doctor
                doctor.Specialty = request.Specialty ?? doctor.Specialty;
                if (request.ExperienceYears.HasValue)
                    doctor.ExperienceYears = request.ExperienceYears.Value;
                if (request.ConsultationFee.HasValue)
                    doctor.ConsultationFee = request.ConsultationFee.Value;

                await _doctorRepository.UpdateAsync(doctor);

                return Ok(new { message = "Doctor profile updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating doctor", error = ex.Message });
            }
        }
    }
}