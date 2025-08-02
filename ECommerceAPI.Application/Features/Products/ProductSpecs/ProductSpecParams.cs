using ECommerceAPI.Application.Specification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Products.ProductSpecs
{
    public class ProductSpecParams : PagingParams
    {


        private List<string> _brands = [];

        public List<string> Brands
        {
            get => _brands;
            set
            {
                _brands = value.SelectMany(x => x.Split(',', StringSplitOptions.RemoveEmptyEntries)).ToList();
            }
        }

        private List<string> _categories = [];

        public List<string> Categories
        {
            get => _categories;
            set
            {
                _categories = value.SelectMany(x => x.Split(',', StringSplitOptions.RemoveEmptyEntries)).ToList();
            }
        }
        public string? Sort { get; set; }
        public string? _search { get; set; }
        public string? Search 
        {
            get => _search ?? "";
            set => _search = value.ToLower();
        }
    }
}
