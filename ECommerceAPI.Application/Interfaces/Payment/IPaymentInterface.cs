using ECommerceAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Interfaces.Payment
{
    public interface IPaymentInterface
    {
        Task<Domain.Entities.Cart> CreateOrUpdatePaymentIntent(string cartId);
        Task<string> RefundPayment(string paymentIntentId);
    }
}
