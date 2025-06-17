using Backend.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Core.Interfaces
{
    public interface IRelativeRepository : IGenericRepository<Relative>
    {
        // Add specific methods for relatives if needed, e.g., GetRelativesByUserId
    }
}