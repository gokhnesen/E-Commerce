using AutoMapper;
using ECommerceAPI.Application.Features.Admin.Queries.GetOrders;
using ECommerceAPI.Application.Features.Orders.OrderSpecs;
using ECommerceAPI.Application.Features.Products.Queries.GetById;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Interfaces.Brand;
using ECommerceAPI.Application.Interfaces.Order;
using ECommerceAPI.Domain.Entities;
using ECommerceAPI.Domain.Entities.Order;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Admin.Queries.GetById
{
    public class GetByIdAdminOrderQueryHandler : IRequestHandler<GetByIdAdminOrderQuery, GetByIdAdminOrderQueryResponse>
    {
        private readonly IOrderReadRepository _orderReadRepository;
        private readonly IMapper _mapper;

        public GetByIdAdminOrderQueryHandler(IOrderReadRepository orderReadRepository, IMapper mapper)
        {
            _orderReadRepository = orderReadRepository;
            _mapper = mapper;
        }

        public async Task<GetByIdAdminOrderQueryResponse> Handle(GetByIdAdminOrderQuery request, CancellationToken cancellationToken)
        {
          
             var spec = new OrderSpecification(request.Id);
             var order = await _orderReadRepository.GetEntityWithSpec(spec);

             GetByIdAdminOrderQueryResponse response = _mapper.Map<GetByIdAdminOrderQueryResponse>(order);


            return response;

        }
    }
}
