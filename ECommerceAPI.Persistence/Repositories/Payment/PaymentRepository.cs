using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Interfaces.Cart;
using ECommerceAPI.Application.Interfaces.Payment;
using ECommerceAPI.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Persistence.Repositories.Payment
{
    public class PaymentRepository(IConfiguration config, ICartReadRepository cartReadRepository,ICartWriteRepository cartWriteRepository, IProductReadRepository productReadRepository,IReadRepository<DeliveryMethod> dm) : IPaymentInterface
    {
        public async Task<Domain.Entities.Cart> CreateOrUpdatePaymentIntent(string cartId)
        {
            StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];
            var cart = await cartReadRepository.GetCartAsync(cartId);
            if(cart == null) return null;

            var shippingPrice = 0m;
            if (!string.IsNullOrEmpty(cart.PaymentIntentId))
            {
                var deliveryMethod = await dm.GetByIdAsync(cart.DeliveryMethodId);
                if (deliveryMethod == null) return null;

                shippingPrice = deliveryMethod.Price;
            }

            foreach (var item in cart.Items)
            {
                var product = await productReadRepository.GetByIdAsync(item.ProductId);
                if (product == null) return null;
                if(item.Price != product.Price)
                {
                    item.Price = product.Price;
                }
            }

            var service = new PaymentIntentService();
            PaymentIntent? intent = null;

            if(string.IsNullOrEmpty(cart.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = ((long)cart.Items.Sum(x => x.Quantity * (x.Price * 100)) + (long)shippingPrice * 100),
                    Currency = "usd",
                    PaymentMethodTypes = ["card"]

                    
                };
                intent = await service.CreateAsync(options);
                cart.PaymentIntentId = intent.Id;
                cart.ClientSecret = intent.ClientSecret;
            }
            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = ((long)cart.Items.Sum(x => x.Quantity * (x.Price * 100)) + (long)shippingPrice * 100),
                };
                intent = await service.UpdateAsync(cart.PaymentIntentId, options);
            }

            await cartWriteRepository.SetCartAsync(cart);
            return cart;
        }
    }
}
