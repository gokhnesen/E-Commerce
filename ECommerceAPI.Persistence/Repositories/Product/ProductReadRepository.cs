using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Domain.Entities;
using ECommerceAPI.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAPI.Persistence.Repositories
{
    public class ProductReadRepository : ReadRepository<Product>, IProductReadRepository
    {
        private readonly ECommerceAPIDbContext _context;

        public ProductReadRepository(ECommerceAPIDbContext context) : base(context)
        {
            _context = context;
        }
    }
}