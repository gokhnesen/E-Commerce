using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Domain.Entities;
using ECommerceAPI.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Persistence.Repositories
{
    public class CategoryReadRepository : ReadRepository<Category>, ICategoryReadRepository
    {
        public CategoryReadRepository(ECommerceAPIDbContext context) : base(context)
        {
        }

        public async Task<List<Domain.Entities.Category>> GetCategoryWithChildrenAsync(string categoryName)
        {
            List<Domain.Entities.Category> result = new();

            // Find the parent category
            var parentCategory = await GetWhere(c => c.Name.ToLower() == categoryName.ToLower(), false)
                .Include(c => c.SubCategories)
                .FirstOrDefaultAsync();

            if (parentCategory == null)
                return result;

            // Add the parent category itself
            result.Add(parentCategory);

            // Helper function to recursively get all subcategories
            void AddChildCategories(Domain.Entities.Category category)
            {
                if (category.SubCategories != null)
                {
                    foreach (var subCategory in category.SubCategories)
                    {
                        result.Add(subCategory);
                        AddChildCategories(subCategory);
                    }
                }
            }

            // Get all subcategories
            AddChildCategories(parentCategory);

            return result;
        }
    }
}
