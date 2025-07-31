using ECommerceAPI.Domain.Entities;
using MediatR;

namespace ECommerceAPI.Application.Features.Payments.Commands.CreatePaymentIntent
{
    public class CreatePaymentIntentCommand : IRequest<CreatePaymentIntentResponse>
    {
        public string CartId { get; set; }

    }
}   