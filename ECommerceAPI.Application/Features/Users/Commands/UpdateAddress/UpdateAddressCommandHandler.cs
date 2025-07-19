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

        public UpdateAddressCommandHandler(
            UserManager<User> userManager,
            IHttpContextAccessor httpContextAccessor,
            ILogger<UpdateAddressCommandHandler> logger)
        {
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
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
                    currentUser.Address = CreateNewAddress(request);
                }
                else
                {
                    UpdateExistingAddress(currentUser.Address, request);
                }

                var result = await _userManager.UpdateAsync(currentUser);

                if (result.Succeeded)
                {
                    _logger.LogInformation("Adres {Action} - UserId: {UserId}",
                        isNewAddress ? "oluşturuldu" : "güncellendi", currentUser.Id);

                    // Response'u explicit olarak oluştur
                    var response = new UpdateAddressResponse
                    {
                        IsSuccess = true,
                        Message = $"Adres başarıyla {(isNewAddress ? "oluşturuldu" : "güncellendi")}.",
                        IsNewAddress = isNewAddress
                    };

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

        private static Address CreateNewAddress(UpdateAddressCommand request)
        {
            return new Address
            {
                Line1 = request.Line1,
                Line2 = request.Line2,
                City = request.City,
                State = request.State,
                Country = request.Country,
                PostalCode = request.PostalCode
            };
        }

        private static void UpdateExistingAddress(Address address, UpdateAddressCommand request)
        {
            address.Line1 = request.Line1;
            address.Line2 = request.Line2;
            address.City = request.City;
            address.State = request.State;
            address.Country = request.Country;
            address.PostalCode = request.PostalCode;
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