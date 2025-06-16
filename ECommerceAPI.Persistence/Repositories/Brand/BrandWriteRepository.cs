using ECommerceAPI.Application.Interfaces.Brand;
using ECommerceAPI.Domain.Entities;
using ECommerceAPI.Persistence.Contexts;

namespace ECommerceAPI.Persistence.Repositories.Brand
{
    public class BrandWriteRepository : WriteRepository<Domain.Entities.Brand>, IBrandWriteRepository
    {
        public BrandWriteRepository(ECommerceAPIDbContext context) : base(context)
        {
        }
    }
} 