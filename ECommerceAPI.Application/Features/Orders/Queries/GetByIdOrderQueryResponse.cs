using ECommerceAPI.Domain.Entities;
using ECommerceAPI.Domain.Entities.Order;

namespace ECommerceAPI.Application.Features.Orders.Queries
{
    public class GetByIdOrderQueryResponse
    {
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public required string BuyerEmail { get; set; }
        public ShippingAddress ShippingAddress { get; set; } = null!;
        public DeliveryMethod DeliveryMethod { get; set; } = null!;

        public PaymentSummary PaymentSummary { get; set; }
        public IReadOnlyList<OrderItem> OrderItems { get; set; } = [];

        public decimal Subtotal { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public required string PaymentIntentId { get; set; }
    }
}