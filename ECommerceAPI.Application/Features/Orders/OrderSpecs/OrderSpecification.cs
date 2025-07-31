using ECommerceAPI.Application.Specification;
using ECommerceAPI.Domain.Entities.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Orders.OrderSpecs
{
    public class OrderSpecification : BaseSpecification<Order>
    {
        public OrderSpecification(string email) : base(x => x.BuyerEmail == email)
        {
            AddInclude(x => x.OrderItems);
            AddInclude(x => x.DeliveryMethod);
            AddOrderByDescending(x => x.OrderDate);
        }

        public OrderSpecification(string email, Guid id) : base(x => x.BuyerEmail == email && x.Id == id)
        {
            AddInclude("OrderItems");
            AddInclude("DeliveryMethod");

        }

        public OrderSpecification(string paymentIntentId, bool isPaymentIntent) : 
            base(x => x.PaymentIntentId == paymentIntentId)
        {
            AddInclude("OrderItems");
            AddInclude("DeliveryMethod");
        }
    }
}
