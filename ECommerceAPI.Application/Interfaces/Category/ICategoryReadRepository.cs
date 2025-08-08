using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Interfaces
{
    public interface ICategoryReadRepository : IReadRepository<Domain.Entities.Category>
    {
        Task<List<Domain.Entities.Category>> GetCategoryWithChildrenAsync(string categoryName);
    }
}
