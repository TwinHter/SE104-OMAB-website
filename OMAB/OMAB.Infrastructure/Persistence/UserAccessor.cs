using System;
using OMAB.Application.Interfaces;
using OMAB.Domain.Entities;
using Microsoft.AspNetCore.Http;
using OMAB.Infrastructure.Persistence;
using System.Security.Claims;


namespace OMAB.Infrastructure.Security;

public class UserAccessor(IHttpContextAccessor httpContextAccessor, AppDbContext context) : IUserAccessor
{
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
