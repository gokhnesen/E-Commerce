using AutoMapper;
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
        private readonly IMapper _mapper;

        public RegisterUserCommandHandler(
            UserManager<User> userManager,
            ILogger<RegisterUserCommandHandler> logger,
            IMapper mapper)
        {
            _userManager = userManager;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<RegisterUserResponse> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var existingUser = await _userManager.FindByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    _logger.LogWarning("Kayıt denemesi başarısız - Email zaten kayıtlı: {Email}", request.Email);
                    return CreateErrorResponse("Bu email adresi zaten kayıtlı.", new List<string> { "Bu email adresi zaten kayıtlı." });
                }

                // AutoMapper ile User oluştur
                var newUser = _mapper.Map<User>(request);
                newUser.UserName = request.Email; // UserName'i Email ile eşitle
                newUser.EmailConfirmed = false; // Email onayını false yap

                var result = await _userManager.CreateAsync(newUser, request.Password);

                if (result.Succeeded)
                {
                    _logger.LogInformation("Kullanıcı başarıyla kaydedildi: {Email}", request.Email);

                    // AutoMapper ile response oluştur
                    var response = _mapper.Map<RegisterUserResponse>(newUser);
                    response.IsSuccess = true;
                    response.Message = "Kullanıcı başarıyla kaydedildi.";

                    return response;
                }
                else
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    var errorMessage = string.Join(", ", errors);
                    _logger.LogError("Kullanıcı kayıt başarısız: {Email}. Hatalar: {Errors}", request.Email, errorMessage);

                    return CreateErrorResponse("Kullanıcı kaydı başarısız oldu.", errors);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanıcı kayıt sırasında beklenmeyen hata: {Email}", request.Email);
                return CreateErrorResponse("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.",
                    new List<string> { "Sistem hatası oluştu." });
            }
        }

        private static RegisterUserResponse CreateErrorResponse(string message, List<string> errors)
        {
            return new RegisterUserResponse
            {
                IsSuccess = false,
                Message = message,
                Errors = errors
            };
        }
    }
}