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

        public IQueryable<Product> GetFilteredProducts(bool tracking = true, List<string>? brands = null, List<string>? types = null)
        {
            var query = Table.AsQueryable();

            // Include Brand ve Category bilgilerini dahil et (eğer navigation property'ler varsa)
            query = query.Include(p => p.Brand)
                         .Include(p => p.Category);

            // Brand filtreleme
            if (brands != null && brands.Any())
            {
                // Brand Name ile filtreleme
                query = query.Where(p => p.Brand != null && brands.Contains(p.Brand.Name));

                // Alternatif: Brand ID ile filtreleme (eğer brand ID'leri gönderiyorsanız)
                // query = query.Where(p => brands.Contains(p.BrandId.ToString()));
            }

            // Type/Category filtreleme
            if (types != null && types.Any())
            {
                // Category Name ile filtreleme
                query = query.Where(p => p.Category != null && types.Contains(p.Category.Name));

                // Alternatif: Product Type property'si varsa
                // query = query.Where(p => types.Contains(p.Type));
            }

            if (!tracking)
                query = query.AsNoTracking();

            return query;
        }
    }
}