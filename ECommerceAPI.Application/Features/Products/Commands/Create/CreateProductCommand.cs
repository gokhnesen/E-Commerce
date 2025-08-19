using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Products.Commands.Create
{
    public class CreateProductCommand:IRequest<CreateProductResponse>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? PictureUrl { get; set; }
        public string? BrandName { get; set; }
        public string CategoryName { get; set; }

    }

    public class UploadImageDto
    {
        public IFormFile Image { get; set; }
    }
}
