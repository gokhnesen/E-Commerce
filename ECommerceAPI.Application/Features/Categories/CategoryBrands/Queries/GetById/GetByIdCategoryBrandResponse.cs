using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Categories.CategoryBrands.Queries.GetById
{
    public class GetByIdCategoryBrandResponse
    {

        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; }
        public List<BrandDto> Brands { get; set; } = new List<BrandDto>();
        

        public class BrandDto
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
        }
    }
}
