using ECommerceAPI.Application.Interfaces.Brand;
using ECommerceAPI.Domain.Entities;
using ECommerceAPI.Persistence.Contexts;

namespace ECommerceAPI.Persistence.Repositories.Brand
{
    public class BrandReadRepository : ReadRepository<Domain.Entities.Brand>, IBrandReadRepository
    {
        public BrandReadRepository(ECommerceAPIDbContext context) : base(context)
        {
        }
    }
} 