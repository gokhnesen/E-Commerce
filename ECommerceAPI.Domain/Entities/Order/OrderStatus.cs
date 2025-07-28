using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Domain.Entities.Order
{
    public enum OrderStatus
    {
        Pending,

        PaymentReceivedd,

        PaymenFailed
    }
}
