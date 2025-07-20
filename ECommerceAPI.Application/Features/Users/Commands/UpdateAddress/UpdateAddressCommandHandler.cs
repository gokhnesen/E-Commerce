using AutoMapper;
using ECommerceAPI.Application.Extensions;
using ECommerceAPI.Application.Features.Addresses.Commands.UpdateAddress;
using ECommerceAPI.Application.Features.Users.Commands.UpdateAddress;
using ECommerceAPI.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace ECommerceAPI.Application.Features.Addresses.Commands.UpdateAddress
{
    public class UpdateAddressCommandHandler : IRequestHandler<UpdateAddressCommand, UpdateAddressResponse>
    {
        private readonly UserManager<User> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<UpdateAddressCommandHandler> _logger;
        private readonly IMapper _mapper;

        public UpdateAddressCommandHandler(
            UserManager<User> userManager,
            IHttpContextAccessor httpContextAccessor,
            ILogger<UpdateAddressCommandHandler> logger,
            IMapper mapper)
        {
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<UpdateAddressResponse> Handle(UpdateAddressCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // HttpContext null check
                if (_httpContextAccessor.HttpContext?.User == null)
                {
                    return CreateErrorResponse("Kullanıcı bilgisi bulunamadı.");
                }

                var currentUser = await _userManager.GetUserByEmailWithAddress(_httpContextAccessor.HttpContext.User);

                var isNewAddress = currentUser.Address == null;

                if (isNewAddress)
                {
                    // AutoMapper ile yeni adres oluştur
                    currentUser.Address = _mapper.Map<Address>(request);
                }
                else
                {
                    // Mevcut adrese AutoMapper ile map et
                    _mapper.Map(request, currentUser.Address);
                }

                var result = await _userManager.UpdateAsync(currentUser);

                if (result.Succeeded)
                {
                    _logger.LogInformation("Adres {Action} - UserId: {UserId}",
                        isNewAddress ? "oluşturuldu" : "güncellendi", currentUser.Id);

                    // AutoMapper ile response oluştur
                    var response = _mapper.Map<UpdateAddressResponse>(currentUser.Address);
                    response.IsSuccess = true;
                    response.Message = $"Adres başarıyla {(isNewAddress ? "oluşturuldu" : "güncellendi")}.";
                    response.IsNewAddress = isNewAddress;

                    return response;
                }

                return CreateErrorResponse("Adres güncellenirken bir hata oluştu.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Adres güncelleme sırasında hata oluştu");
                return CreateErrorResponse("Kullanıcı bulunamadı veya adres işlemi başarısız.");
            }
        }

        private static UpdateAddressResponse CreateErrorResponse(string message)
        {
            return new UpdateAddressResponse
            {
                IsSuccess = false,
                Message = message,
                IsNewAddress = false
            };
        }
    }
}