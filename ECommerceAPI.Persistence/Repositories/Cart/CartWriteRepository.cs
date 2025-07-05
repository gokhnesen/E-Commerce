using ECommerceAPI.Application.Interfaces.Cart;
using ECommerceAPI.Persistence.Repositories.Cart;

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
    public class CartWriteRepository : CartReadRepository, ICartWriteRepository
    {
        private readonly IDatabase _database;

        public CartWriteRepository(IConnectionMultiplexer redis) : base(redis)
        {
            _database = redis.GetDatabase();
        }

        public async Task<bool> DeleteCartAsync(string key)
        {
            return await _database.KeyDeleteAsync(key);
        }

        public async Task<Domain.Entities.Cart> SetCartAsync(Domain.Entities.Cart cart)
        {
            var created = await _database.StringSetAsync(cart.Id.ToString(), JsonSerializer.Serialize(cart), TimeSpan.FromDays(7));
            if (!created) return null;

            return await GetCartAsync(cart.Id.ToString());
        }
    }
}
