using ECommerceAPI.Domain.Entities.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Interfaces.Order
{
    public interface IOrderWriteRepository : IWriteRepository<Domain.Entities.Order.Order>
    {

    }
}
