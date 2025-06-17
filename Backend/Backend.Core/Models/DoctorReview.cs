using System;

namespace Backend.Core.Models
{
    public class DoctorReview
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string DoctorId { get; set; } // FK
        public Doctor Doctor { get; set; } // Navigation property

        public string PatientName { get; set; } // Could be FK to User if we want patient ID
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}