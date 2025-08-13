using ECommerceAPI.Application.Interfaces.BrandCategory;
using ECommerceAPI.Persistence.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Persistence.Repositories.CategoryBrand
{
    public class CategoryBrandReadRepository : ReadRepository<Domain.Entities.CategoryBrand>, ICategoryBrandReadRepository
    {
        public CategoryBrandReadRepository(ECommerceAPIDbContext context) : base(context)
        {
        }
    }

}
