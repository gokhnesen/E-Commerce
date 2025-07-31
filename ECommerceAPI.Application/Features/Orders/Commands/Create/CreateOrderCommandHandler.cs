using AutoMapper;
using ECommerceAPI.Application.Extensions;
using ECommerceAPI.Application.Features.Products.Commands.Create;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Interfaces.Cart;
using ECommerceAPI.Application.Interfaces.DeliveryMethod;
using ECommerceAPI.Application.Interfaces.Order;
using ECommerceAPI.Domain.Entities;
using ECommerceAPI.Domain.Entities.Order;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Orders.Commands.Create
{
    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, CreateOrderResponse>
    {
        private readonly IOrderWriteRepository _orderWriteRepository;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ICartReadRepository _cartReadRepository;
        private readonly IProductReadRepository _productReadRepository;
        private readonly IDeliveryReadRepository _deliveryReadRepository;
        private readonly IMapper _mapper;

        public CreateOrderCommandHandler(IOrderWriteRepository orderWriteRepository, IHttpContextAccessor contextAccessor, ICartReadRepository cartReadRepository, IProductReadRepository productReadRepository, IDeliveryReadRepository deliveryReadRepository, IMapper mapper)
        {
            _orderWriteRepository = orderWriteRepository;
            _contextAccessor = contextAccessor;
            _cartReadRepository = cartReadRepository;
            _productReadRepository = productReadRepository;
            _deliveryReadRepository = deliveryReadRepository;
            _mapper = mapper;
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

            var order = _mapper.Map<Order>(request);
            order.OrderItems = items;
            order.Subtotal = order.OrderItems.Sum(x => x.Price * x.Quantity);
            order.BuyerEmail = email;
            order.PaymentIntentId = cart.PaymentIntentId;
            order.DeliveryMethod = deliveryMethod;

            var createdOrder = await _orderWriteRepository.AddAsync(order);
            await _orderWriteRepository.SaveAsync();
            
            CreateOrderResponse createOrderResponse = _mapper.Map<CreateOrderResponse>(order);
            createOrderResponse.ShippingPrice = deliveryMethod.Price;
            createOrderResponse.Subtotal = order.Subtotal;
            createOrderResponse.Total = order.GetTotal();


            return createOrderResponse;

        }


    }
}
