using ECommerceAPI.Domain.Entities.Order;
using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Orders.Commands.Create
{
    public class CreateOrderCommand : IRequest<CreateOrderResponse>
    {
        [Required]
        public string CartId { get; set; } = string.Empty;
        [Required]
        public string DeliveryMethodId { get; set; }
        [Required]
        public ShippingAddress ShippingAddress { get; set; }
        [Required]
        public PaymentSummary PaymentSummary { get; set; }


    }
}
