using System;
using System.Collections.Generic;

namespace Backend.Core.Models
{
    public class Doctor
    {
        public string Id { get; set; } // FK to User.Id for Doctor role
        public string Specialty { get; set; }
        public decimal ConsultationFee { get; set; }
        public int ExperienceYears { get; set; }
        public string Location { get; set; }
        public Dictionary<string, List<string>> Availability { get; set; } = new Dictionary<string, List<string>>(); // Stored as JSON
        public decimal? AvgRating { get; set; }
        public int? TotalAppointments { get; set; }

        // Navigation property for One-to-one relationship with User
        public User User { get; set; }
        public ICollection<DoctorReview> Reviews { get; set; } = new List<DoctorReview>();
    }
}