using ECommerceAPI.Application.Interfaces.Brand;
using ECommerceAPI.Application.Interfaces.Cart;
using ECommerceAPI.Domain.Entities;
using ECommerceAPI.Persistence.Contexts;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ECommerceAPI.Persistence.Repositories.Cart
{
    public class CartReadRepository(IConnectionMultiplexer redis) : ICartReadRepository
    {
        private readonly IDatabase _database = redis.GetDatabase();
        public async Task<Domain.Entities.Cart> GetCartAsync(string key)
        {
            
            var data = await _database.StringGetAsync(key);
            return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<Domain.Entities.Cart>(data!);
        }
    }   
}
