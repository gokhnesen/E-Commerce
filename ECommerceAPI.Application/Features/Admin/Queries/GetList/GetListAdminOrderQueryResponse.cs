using ECommerceAPI.Domain.Entities;
using ECommerceAPI.Domain.Entities.Order;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Admin.Queries.GetList
{
    public class GetListAdminOrderQueryResponse 
    {
        public Guid Id { get; set; }
        public DateTime OrderDate { get; set; }
        public string BuyerEmail { get; set; }
        public ShippingAddress ShippingAddress { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }
        public PaymentSummary PaymentSummary { get; set; }
        public IReadOnlyList<OrderItem> OrderItems { get; set; }
        public decimal Subtotal { get; set; }
        public required string Status { get; set; }
        public decimal Total { get; set; }
        public string PaymentIntentId { get; set; }
    }
}
