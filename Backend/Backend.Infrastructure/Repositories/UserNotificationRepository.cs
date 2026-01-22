using Microsoft.EntityFrameworkCore;
using Backend.Core.Interfaces;
using Backend.Core.Models;
using Backend.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Infrastructure.Repositories
{
    public class UserNotificationRepository : GenericRepository<UserNotification>, IUserNotificationRepository
    {
        public UserNotificationRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<UserNotification>> GetNotificationsByUserIdAsync(string userId)
        {
            return await _context.UserNotifications.Where(n => n.UserId == userId).ToListAsync();
        }
    }
}