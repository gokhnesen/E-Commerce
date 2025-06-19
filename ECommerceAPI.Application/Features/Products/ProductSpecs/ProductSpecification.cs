using ECommerceAPI.Application.Features.Specification;
using ECommerceAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Products.ProductSpecs
{
    public class ProductSpecification : BaseSpecification<Product>
    {
        public ProductSpecification(string? brand, string? category) : base(x => 
        (string.IsNullOrWhiteSpace(brand) || x.Brand.Name== brand) &&
        (string.IsNullOrWhiteSpace(category) || x.Category.Name == category))
        {
            
        }
    }
}
