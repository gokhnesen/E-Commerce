using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Categories.CategoryBrands.Queries.GetById
{
    public class GetByIdCategoryBrandQuery : IRequest<GetByIdCategoryBrandResponse>
    {
        public Guid CategoryId { get; set; }
    }
}
