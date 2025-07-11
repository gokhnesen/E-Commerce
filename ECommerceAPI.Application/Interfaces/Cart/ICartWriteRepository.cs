using ECommerceAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Interfaces.Cart
{
    public interface ICartWriteRepository
    {
        Task<Domain.Entities.Cart> SetCartAsync(Domain.Entities.Cart cart);
        Task<bool> DeleteCartAsync(string key); 
    }
}
