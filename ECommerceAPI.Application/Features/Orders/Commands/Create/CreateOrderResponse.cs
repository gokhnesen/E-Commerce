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
        public bool Success { get; set; }
        public string Message { get; set; } = "Sipariş başarıyla oluşturuldu";
    }
}
