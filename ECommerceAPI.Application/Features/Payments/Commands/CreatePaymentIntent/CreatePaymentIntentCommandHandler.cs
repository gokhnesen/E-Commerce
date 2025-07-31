using AutoMapper;
using ECommerceAPI.Application.Interfaces.Payment;
using ECommerceAPI.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ECommerceAPI.Application.Features.Payments.Commands.CreatePaymentIntent
{
    public class CreatePaymentIntentCommandHandler : IRequestHandler<CreatePaymentIntentCommand, CreatePaymentIntentResponse>
    {
        private readonly IPaymentInterface _paymentService;
        private readonly ILogger<CreatePaymentIntentCommandHandler> _logger;

        public CreatePaymentIntentCommandHandler(
            IPaymentInterface paymentService,
            ILogger<CreatePaymentIntentCommandHandler> logger)
        {
            _paymentService = paymentService;   
            _logger = logger;
        }
            

        async Task<CreatePaymentIntentResponse> IRequestHandler<CreatePaymentIntentCommand, CreatePaymentIntentResponse>.Handle(CreatePaymentIntentCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var cart = await _paymentService.CreateOrUpdatePaymentIntent(request.CartId);

                if (cart == null)
                {
                    _logger.LogWarning("Payment intent creation failed for CartId: {CartId}", request.CartId);
                    throw new Exception("Ödeme işlemi başarısız.");
                }

                _logger.LogInformation("Payment intent created/updated successfully for CartId: {CartId}", request.CartId);

                // Map Cart to CreatePaymentIntentResponse
                var response = new CreatePaymentIntentResponse
                {
                    CartId = cart.Id,
                    ClientSecret = cart.ClientSecret,
                    PaymentIntentId = cart.PaymentIntentId
                };
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating payment intent for CartId: {CartId}", request.CartId);
                throw;
            }
        }
    }
}