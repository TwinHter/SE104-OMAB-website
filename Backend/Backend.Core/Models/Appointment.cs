using Backend.Core.Enums;
using System;
using System.Collections.Generic;

namespace Backend.Core.Models
{
    public class Appointment
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public DateTime Date { get; set; } // "YYYY-MM-DD" combined with "HH:MM"
        public string DoctorId { get; set; }
        public User Doctor { get; set; } // Navigation property for the Doctor user

        public string PatientId { get; set; }
        public User Patient { get; set; } // Navigation property for the Patient user

        public string? Symptoms { get; set; }
        public string? Notes { get; set; } // Doctor's diagnosis/notes
        public AppointmentStatus Status { get; set; }
        public decimal Cost { get; set; }

        public AppointmentOutcomeStatus? OutcomeStatus { get; set; }

        // Navigation properties
        public ICollection<Medication> Prescription { get; set; } = new List<Medication>();
        public AppointmentPatientReview? PatientReview { get; set; } // One-to-one
    }
}