using System;

namespace Backend.Core.Models
{
    public class AppointmentPatientReview
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string AppointmentId { get; set; } // FK
        public Appointment Appointment { get; set; } // Navigation property

        public int Rating { get; set; }
        public string Comment { get; set; }
    }
}