using System;
using Microsoft.AspNetCore.Http;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;
using OMAB.Domain.Enums;
using OMAB.Infrastructure.Persistence;

namespace OMAB.Infrastructure.Services;

public class DevUserAccessor(AppDbContext context, IHttpContextAccessor httpContextAccessor) : IUserAccessor
{
    public bool CanViewUser(int targetUserId, UserRole targetUserRole)
    {
        var currentUserId = GetCurrentUserId();
        var currentUser = GetCurrentUserAsync().Result;

        if (currentUser.UserRole == UserRole.Admin)
            return true;

        if (currentUser.UserRole == UserRole.Doctor)
            return targetUserRole is UserRole.Doctor or UserRole.Patient;

        if (currentUser.UserRole == UserRole.Patient)
            return targetUserId == currentUserId;

        return false;
    }

    public async Task<User> GetCurrentUserAsync()
    {
        var userId = GetCurrentUserId();
        return await context.Users.FindAsync(userId) ?? throw new UnauthorizedAccessException("Có lỗi khi lấy thông tin người dùng.");
    }

    public int GetCurrentUserId()
    {
        var headerId = httpContextAccessor.HttpContext?.Request.Headers["x-user-id"].ToString();

        if (int.TryParse(headerId, out int userId))
        {
            return userId;
        }

        return 1;
    }
}
