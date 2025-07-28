using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Orders.Queries
{
    public class GetByIdOrderQuery: IRequest<GetByIdOrderQueryResponse>
    {
        public Guid Id { get; set; }
    }
}
