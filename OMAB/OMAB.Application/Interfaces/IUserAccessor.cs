using System;
using OMAB.Domain.Entities;
namespace OMAB.Application.Interfaces;

public interface IUserAccessor
{
    int GetCurrentUserId();
    Task<User> GetCurrentUserAsync();
}
