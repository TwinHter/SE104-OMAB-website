using Backend.Core.Enums;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Api.DTOs
{
    // For GET /api/appointments response
    public class AppointmentDto
    {
        public string Id { get; set; }
        public string Date { get; set; } // ISO-MM-DDTHH:MM:SSZ
        public AppointmentDoctorInfoDto Doctor { get; set; }
        public string PatientId { get; set; }
        public string PatientName { get; set; }
        public string? Symptoms { get; set; }
        public string? Notes { get; set; }
        public ICollection<MedicationDto>? Prescription { get; set; }
        public string Status { get; set; } // Enum string representation
        public decimal Cost { get; set; }
        public PatientReviewInputDto? PatientReview { get; set; }
        public string? OutcomeStatus { get; set; } // Enum string representation
    }

    // Nested DTO for Doctor info in Appointment
    public class AppointmentDoctorInfoDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Specialty { get; set; }
        public string? AvatarUrl { get; set; }
    }

    // Nested DTO for Medication
    public class MedicationDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string? Dosage { get; set; }
        public string? Frequency { get; set; }
        public string? Duration { get; set; }
    }

    // For POST /api/appointments request
    public class CreateAppointmentRequestDto
    {
        [Required]
        public string Date { get; set; } // YYYY-MM-DD
        [Required]
        public string Time { get; set; } // HH:MM
        [Required]
        public AppointmentDoctorInfoDto Doctor { get; set; } // Using this as input directly
        [Required]
        public string PatientId { get; set; }
        [Required]
        public string PatientName { get; set; }
        public string? Symptoms { get; set; }
        public decimal Cost { get; set; } = 0; // Optional in frontend, but required here with default
    }

    // For PATCH /api/appointments/{appointmentId} request
    public class UpdateAppointmentStatusDto
    {
        public AppointmentStatus Status { get; set; } // Enum value
    }

    // For PATCH /api/appointments/{appointmentId}/outcome request
    public class UpdateAppointmentOutcomeDto
    {
        public AppointmentOutcomeStatus OutcomeStatus { get; set; } // Enum value
        public string? Notes { get; set; }
        public ICollection<MedicationDto>? Prescription { get; set; }
    }

    // For POST/PATCH /api/appointments/{appointmentId}/review request
    public class PatientReviewInputDto
    {
        [Range(1, 5)]
        public int Rating { get; set; }
        public string Comment { get; set; }
    }
}