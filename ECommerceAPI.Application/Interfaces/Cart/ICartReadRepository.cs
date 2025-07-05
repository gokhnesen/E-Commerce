using ECommerceAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Interfaces.Cart
{
    public interface ICartReadRepository
    {
        Task<Domain.Entities.Cart> GetCartAsync(Guid key);

    }
}
