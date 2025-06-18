using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Products.ProductSpecParameters
{
    public class ProductSpecParams
    {
        private List<string> _brands;

        public List<string> Brands
        {
            get => _brands;
            set
            {
                _brands = value.SelectMany(x => x.Split(',', StringSplitOptions.RemoveEmptyEntries)).ToList();
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
