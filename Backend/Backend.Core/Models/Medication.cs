using System;

namespace Backend.Core.Models
{
    public class Medication
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; }
        public string? Dosage { get; set; }
        public string? Frequency { get; set; }
        public string? Duration { get; set; }

        public string AppointmentId { get; set; } // FK
        public Appointment Appointment { get; set; } // Navigation property
    }
}