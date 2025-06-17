using Backend.Core.Interfaces;
using Backend.Core.Models;
using Backend.Infrastructure.Data;

namespace Backend.Infrastructure.Repositories
{
    public class RelativeRepository : GenericRepository<Relative>, IRelativeRepository
    {
        public RelativeRepository(AppDbContext context) : base(context) { }

        // You can add specific methods for Relative here if needed, e.g., GetRelativesByUserId
        // public async Task<IEnumerable<Relative>> GetRelativesByUserIdAsync(string userId)
        // {
        //     return await _context.Relatives.Where(r => r.UserId == userId).ToListAsync();
        // }
    }
}