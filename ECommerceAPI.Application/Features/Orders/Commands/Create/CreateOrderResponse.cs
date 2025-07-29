using ECommerceAPI.Domain.Entities.Order;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Orders.Commands.Create
{
    public class CreateOrderResponse
    {

        public Guid Id { get; set; }
        public DateTime OrderDate { get; set; }
        public required string BuyerEmail { get; set; }
        public required ShippingAddress ShippingAddress { get; set; }
        public decimal ShippingPrice { get; set; }
        public required string DeliveryMethod { get; set; }

        public required PaymentSummary PaymentSummary { get; set; }
        public required List<OrderItem> OrderItems { get; set; } = [];

        public decimal Subtotal { get; set; }
        public required string Status { get; set; }
        public decimal Total { get; set; }

        public required string PaymentIntentId { get; set; }


    }
}
