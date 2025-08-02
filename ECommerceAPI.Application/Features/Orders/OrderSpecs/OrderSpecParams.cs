using ECommerceAPI.Application.Specification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Orders.OrderSpecs
{
    public class OrderSpecParams : PagingParams
    {
        public string? Status { get; set; }

    }
}
