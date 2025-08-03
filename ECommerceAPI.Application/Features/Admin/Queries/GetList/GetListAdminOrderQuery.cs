using ECommerceAPI.Application.Features.Orders.OrderSpecs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Admin.Queries.GetList
{
    public class GetListAdminOrderQuery : IRequest<List<GetListAdminOrderQueryResponse>>
    {
        public OrderSpecParams? SpecParams { get; set; }
        public GetListAdminOrderQuery(OrderSpecParams? specParams)
        {
            SpecParams = specParams ?? new OrderSpecParams();
        }
    }
}
