using ECommerceAPI.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Users.Commands.Register
{
    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, RegisterUserResponse>
    {
        private readonly UserManager<User> _userManager;
        private readonly ILogger<RegisterUserCommandHandler> _logger;

        public RegisterUserCommandHandler(UserManager<User> userManager, ILogger<RegisterUserCommandHandler> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<RegisterUserResponse> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var existingUser = await _userManager.FindByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    _logger.LogWarning("Kayıt denemesi başarısız - Email zaten kayıtlı: {Email}", request.Email);
                    return new RegisterUserResponse
                    {
                        IsSuccess = false,
                        Message = "Bu email adresi zaten kayıtlı.",
                        Errors = new List<string> { "Bu email adresi zaten kayıtlı." }
                    };
                }

                var newUser = new User
                {
                    Name = request.Name,
                    LastName = request.LastName,
                    Email = request.Email,
                    UserName = request.Email,
                    EmailConfirmed = false
                };

                var result = await _userManager.CreateAsync(newUser, request.Password);

                if (result.Succeeded)
                {
                    _logger.LogInformation("Kullanıcı başarıyla kaydedildi: {Email}", request.Email);
                    return new RegisterUserResponse
                    {
                        IsSuccess = true,
                        Message = "Kullanıcı başarıyla kaydedildi.",
                        UserId = newUser.Id,
                        Email = newUser.Email
                    };
                }
                else
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    var errorMessage = string.Join(", ", errors);

                    _logger.LogError("Kullanıcı kayıt başarısız: {Email}. Hatalar: {Errors}", request.Email, errorMessage);

                    return new RegisterUserResponse
                    {
                        IsSuccess = false,
                        Message = "Kullanıcı kaydı başarısız oldu.",
                        Errors = errors
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanıcı kayıt sırasında beklenmeyen hata: {Email}", request.Email);
                return new RegisterUserResponse
                {
                    IsSuccess = false,
                    Message = "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.",
                    Errors = new List<string> { "Sistem hatası oluştu." }
                };
            }
        }
    }
}