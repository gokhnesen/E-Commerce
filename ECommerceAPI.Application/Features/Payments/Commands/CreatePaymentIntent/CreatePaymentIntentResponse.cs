using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Payments.Commands.CreatePaymentIntent
{
    public class CreatePaymentIntentResponse
    {
        public string CartId { get; set; }
        public string? PaymentIntentId { get; internal set; }
        public string? ClientSecret { get; internal set; }
    }
}
