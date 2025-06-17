using Backend.Core.Enums;
using System;
using System.Collections.Generic;

namespace Backend.Core.Models
{
    public class User
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; } // Dummy value since no real auth
        public string Salt { get; set; } // Dummy value
        public UserRole Type { get; set; } // Enum for role
        public string? AvatarUrl { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Description { get; set; }
        public string? BloodType { get; set; }
        public string? Allergies { get; set; }
        public string? InsuranceNumber { get; set; }

        // Navigation properties
        public Doctor? DoctorProfile { get; set; } // One-to-one with Doctor
        public ICollection<UserNotification> Notifications { get; set; } = new List<UserNotification>();
        public ICollection<Relative> Relatives { get; set; } = new List<Relative>();

        // Appointments where this user is the Patient
        public ICollection<Appointment> PatientAppointments { get; set; } = new List<Appointment>();
        // Appointments where this user is the Doctor
        public ICollection<Appointment> DoctorAppointments { get; set; } = new List<Appointment>();
    }
}