using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Domain.Entities;
using ECommerceAPI.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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

            var parentCategory = await GetWhere(c => c.Name.ToLower() == categoryName.ToLower(), false)
                .Include(c => c.SubCategories)
                .FirstOrDefaultAsync();

            if (parentCategory == null)
                return result;

            result.Add(parentCategory);

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

            AddChildCategories(parentCategory);

            return result;
        }

        public async Task<Category> GetCategoryWithDirectChildrenAsync(Guid categoryId)
        {
            return await GetWhere(c => c.Id == categoryId, false)
                .Include(c => c.SubCategories)
                .Include(c => c.ParentCategory)
                .FirstOrDefaultAsync();
        }
    }
}
