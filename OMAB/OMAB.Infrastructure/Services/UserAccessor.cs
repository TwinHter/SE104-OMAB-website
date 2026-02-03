using System;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;
using Microsoft.AspNetCore.Http;
using OMAB.Infrastructure.Persistence;
using System.Security.Claims;
using OMAB.Domain.Enums;


namespace OMAB.Infrastructure.Persistence.Services;

public class UserAccessor(IHttpContextAccessor httpContextAccessor, AppDbContext context) : IUserAccessor
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
        var userIdClaim = httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            throw new UnauthorizedAccessException("Người dùng chưa đăng nhập hoặc Token không hợp lệ.");
        }

        return userId;
    }
}
