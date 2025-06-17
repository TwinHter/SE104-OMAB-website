using Backend.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Core.Interfaces
{
    public interface IUserNotificationRepository : IGenericRepository<UserNotification>
    {
        Task<IEnumerable<UserNotification>> GetNotificationsByUserIdAsync(string userId);
    }
}