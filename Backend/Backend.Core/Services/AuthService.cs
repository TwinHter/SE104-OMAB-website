using Backend.Core.Models;
using Backend.Core.Interfaces;
using Backend.Core.Enums;

namespace Backend.Core.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // Đơn giản hóa: chỉ kiểm tra sự tồn tại của user với email và role
        public async Task<User?> ValidateUser(string email, UserRole role)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null || user.Type != role)
            {
                return null;
            }
            return user;
        }

        // Đăng ký người dùng mới (không hash mật khẩu thực tế)
        public async Task<User> RegisterUser(string name, string email, string password, UserRole role)
        {
            var user = new User
            {
                Name = name,
                Email = email,
                Type = role,
                PasswordHash = "dummy_hash", // Mật khẩu giả
                Salt = "dummy_salt" // Muối giả
            };

            await _userRepository.AddAsync(user);
            return user;
        }

        public async Task<bool> ChangePassword(string userId, string currentPassword, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return false;

            // Giả lập kiểm tra mật khẩu hiện tại (nếu bạn dùng hash thực, sẽ dùng PasswordHasher)
            if (user.PasswordHash != currentPassword) // Giả định PasswordHash = plain text
                return false;

            // Cập nhật mật khẩu mới
            user.PasswordHash = newPassword;
            user.Salt = Guid.NewGuid().ToString(); // Giả lập tạo salt mới

            await _userRepository.UpdateAsync(user);
            return true;
        }

    }
}