using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Api.DTOs
{
    // For GET /api/doctors and GET /api/doctors/{doctorId} response
    public class DoctorProfileDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Specialty { get; set; }
        public string AvatarUrl { get; set; }
        public decimal ConsultationFee { get; set; }
        public int ExperienceYears { get; set; }
        public string Location { get; set; }
        public Dictionary<string, List<string>> Availability { get; set; }
        public ICollection<DoctorReviewDto>? Reviews { get; set; }
        public string? Phone { get; set; }
        public string? Gender { get; set; }
        public string? DateOfBirth { get; set; } // YYYY-MM-DD
        public string? Description { get; set; }
        public decimal? Avg_Rating { get; set; }
        public int? Total_Appointments { get; set; }
    }

    // For DoctorReview
    public class DoctorReviewDto
    {
        public string Id { get; set; }
        public string PatientName { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public string Date { get; set; } // ISO-MM-DDTHH:MM:SSZ
    }

    // For POST /api/doctors/{doctorId}/reviews request
    public class CreateDoctorReviewDto
    {
        [Required]
        public string PatientName { get; set; }
        [Range(1, 5)]
        public int Rating { get; set; }
        public string Comment { get; set; }
    }

    // For PATCH /api/doctors/{doctorId}/availability request
    public class UpdateDoctorAvailabilityDto
    {
        [Required]
        public string Date { get; set; } // YYYY-MM-DD
        [Required]
        public List<string> TimeSlots { get; set; } // HH:MM
        [Required]
        public string Status { get; set; } // "available" or "busy" (though status isn't used in backend update logic, keeping for frontend consistency)
    }

    public class CreateDoctorDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }

        [Required]
        public string Specialty { get; set; }
        [Required]
        public decimal ConsultationFee { get; set; }
        [Required]
        public int ExperienceYears { get; set; }
        [Required]
        public string Address { get; set; }
        public string? Phone { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Description { get; set; }
    }
    public class DoctorResponseDto
    {
        public string Id { get; set; }
        public string Specialty { get; set; }
        public decimal ConsultationFee { get; set; }
        public int ExperienceYears { get; set; }
        public string Location { get; set; }
        public decimal? AvgRating { get; set; }
        public int? TotalAppointments { get; set; }

        // User details (flattened)
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string AvatarUrl { get; set; }
    }
    public class UpdateDoctorProfileDto
    {
        // Thông tin chung (User)
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
        public string? Password { get; set; }

        // Thông tin chuyên môn (Doctor)
        public string? Specialty { get; set; }
        public int? ExperienceYears { get; set; }
        public decimal? ConsultationFee { get; set; }
    }

}