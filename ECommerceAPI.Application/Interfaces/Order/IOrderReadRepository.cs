using ECommerceAPI.Domain.Entities.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Interfaces.Order
{
    public interface IOrderReadRepository : IReadRepository<Domain.Entities.Order.Order>
    {

    }
}
