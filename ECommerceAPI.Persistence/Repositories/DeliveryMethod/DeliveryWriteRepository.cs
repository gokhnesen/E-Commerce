using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Interfaces.DeliveryMethod;
using ECommerceAPI.Persistence.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Persistence.Repositories.DeliveryMethod
{
    public class DeliveryWriteRepository : WriteRepository<Domain.Entities.DeliveryMethod>, IDeliveryWriteRepository
    {
        public DeliveryWriteRepository(ECommerceAPIDbContext context) : base(context)
        {

        }
    }
}
