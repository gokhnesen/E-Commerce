using ECommerceAPI.Application.Features.Categories.Queries.GetById;
using System;
using System.Collections.Generic;

namespace ECommerceAPI.Application.Features.Categories.Queries.GetByName
{
    public class GetByNameCategoryResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid? ParentCategoryId { get; set; }
        public string? ParentCategoryName { get; set; }
        public List<ChildCategoryDto> SubCategories { get; set; } = new List<ChildCategoryDto>();
    }


}