using ECommerceAPI.Application.Specification;
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
        public ProductSpecification(ProductSpecParams specParams, List<string> allCategoryNames = null) : base(x => 
        (string.IsNullOrEmpty(specParams.Search) || x.Name.ToLower().Contains(specParams.Search)) &&
        (specParams.Brands.Count == 0 || specParams.Brands.Contains(x.Brand.Name)) &&
        (specParams.Categories.Count == 0 || 
            // If allCategoryNames is provided (includes parent and all children), use it for filtering
            (allCategoryNames != null && allCategoryNames.Contains(x.Category.Name)) || 
            // Otherwise use only the specified categories
            (allCategoryNames == null && specParams.Categories.Contains(x.Category.Name)))
        )

        {

            ApplyPaging(specParams.PageSize * (specParams.PageIndex - 1), specParams.PageSize);

            switch(specParams.Sort)
            {
                case "priceAsc":
                    AddOrderBy(x => x.Price);
                    break;

                case "priceDesc":
                    AddOrderByDescending(x => x.Price); 
                    break;
                default:
                    AddOrderBy(x => x.Name);
                    break;
            }
        }
    }

}
