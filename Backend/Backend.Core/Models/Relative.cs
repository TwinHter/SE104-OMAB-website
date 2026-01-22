using System;

namespace Backend.Core.Models
{
    public class Relative
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } // FK to User.Id if relatives are tied to a specific user
        public User User { get; set; } // Navigation property

        public string Name { get; set; }
        public string Relationship { get; set; }
        public string? Phone { get; set; }
    }
}