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
        public ProductSpecification(ProductSpecParams specParams, List<string> allCategoryNames = null)
    : base(x =>
        (string.IsNullOrEmpty(specParams.Search ?? "") ||
            (x.Name != null && x.Name.ToLower().Contains(specParams.Search ?? "")) ||
            (x.Brand != null && x.Brand.Name != null && x.Brand.Name.ToLower().Contains(specParams.Search ?? "")) ||
            (x.Category != null && x.Category.Name != null && x.Category.Name.ToLower().Contains(specParams.Search ?? "")) ||
            (!string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(specParams.Search ?? ""))
        )
        &&
        (specParams.Brands.Count == 0 || (x.Brand != null && specParams.Brands.Contains(x.Brand.Name)))
        &&
        (specParams.Categories.Count == 0 ||
            (allCategoryNames != null && x.Category != null && allCategoryNames.Contains(x.Category.Name)) ||
            (allCategoryNames == null && x.Category != null && specParams.Categories.Contains(x.Category.Name))
        )
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
