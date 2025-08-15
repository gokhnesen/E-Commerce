using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Interfaces
{
    public interface ICategoryReadRepository : IReadRepository<Domain.Entities.Category>
    {
        Task<List<Domain.Entities.Category>> GetCategoryWithChildrenAsync(string categoryName);
        Task<Domain.Entities.Category> GetCategoryWithDirectChildrenAsync(Guid categoryId);
    }
}
