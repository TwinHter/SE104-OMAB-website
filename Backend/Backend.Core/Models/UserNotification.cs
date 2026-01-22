using System;

namespace Backend.Core.Models
{
    public class UserNotification
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } // FK
        public User User { get; set; } // Navigation property

        public string Context { get; set; } // The notification message/content
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; }
        public string? Type { get; set; } // Optional: to categorize notifications
        public string? RelatedLink { get; set; } // Optional: a link related to the notification
    }
}