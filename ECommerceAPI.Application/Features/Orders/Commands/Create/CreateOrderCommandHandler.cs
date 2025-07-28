using ECommerceAPI.Application.Interfaces.Order;
using ECommerceAPI.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using ECommerceAPI.Application.Extensions;
using Microsoft.AspNetCore.Http;
using ECommerceAPI.Application.Interfaces.Cart;
using ECommerceAPI.Domain.Entities.Order;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Interfaces.DeliveryMethod;

namespace ECommerceAPI.Application.Features.Orders.Commands.Create
{
    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, CreateOrderResponse>
    {
        private readonly IOrderWriteRepository _orderWriteRepository;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ICartReadRepository _cartReadRepository;
        private readonly IProductReadRepository _productReadRepository;
        private readonly IDeliveryReadRepository _deliveryReadRepository;

        public CreateOrderCommandHandler(IOrderWriteRepository orderWriteRepository, UserManager<User> userManager, IHttpContextAccessor contextAccessor, ICartReadRepository cartReadRepository, IProductReadRepository productReadRepository, IDeliveryReadRepository deliveryReadRepository)
        {
            _orderWriteRepository = orderWriteRepository;
            _contextAccessor = contextAccessor;
            _cartReadRepository = cartReadRepository;
            _productReadRepository = productReadRepository;
            _deliveryReadRepository = deliveryReadRepository;
        }

        public async Task<CreateOrderResponse>? Handle(CreateOrderCommand request, CancellationToken cancellationToken)
        {
            var email = _contextAccessor.HttpContext.User.GetEmail();
            var cart = await _cartReadRepository.GetCartAsync(request.CartId);

            if (cart == null) throw new Exception("Sepet bulunamadı");

            if (cart.PaymentIntentId == null) throw new Exception("Ödeme yöntemi bulunamadı");

            var items = new List<OrderItem>();

            foreach (var item in cart.Items)
            {
                var productItem = await _productReadRepository.GetByIdAsync(Guid.Parse(item.ProductId));

                if (productItem == null) throw new Exception($"{item.ProductId} does not exist");

                var itemOrdered = new ProductItemOrdered
                {
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    PictureUrl = item.PictureUrl
                };
                var orderItem = new OrderItem
                {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = (int)item.Quantity

                };
                items.Add(orderItem);   
            }

            var deliveryMethod = await _deliveryReadRepository.GetByIdAsync(Guid.Parse(request.DeliveryMethodId));

            if (deliveryMethod == null) throw new Exception("Kargo türü seçilmedi");

            var order = new Order
            {
                Id = Guid.NewGuid(),
                OrderItems = items,
                DeliveryMethod = deliveryMethod,
                ShippingAddress = request.ShippingAddress,
                Subtotal = items.Sum(x => x.Price * x.Quantity),
                PaymentSummary = request.PaymentSummary,
                PaymentIntentId = cart.PaymentIntentId,
                BuyerEmail = email
            };

            var createdOrder = await _orderWriteRepository.AddAsync(order);
            await _orderWriteRepository.SaveAsync(); 


            return new CreateOrderResponse
            {
                Success = true,
              
            };

        }


    }
}
