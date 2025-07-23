using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Products.Commands.Delete
{
    public class DeleteProductCommand : IRequest<DeleteProductResponse>
    {
        public string Id { get; set; }
    }
}
