using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Products.Queries.GetById
{
    public class GetByIdProductQuery : IRequest<GetByIdProductQueryResponse>
    {
        public Guid Id { get; set; }
    }
}
