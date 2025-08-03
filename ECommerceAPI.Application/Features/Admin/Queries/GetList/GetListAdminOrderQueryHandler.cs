using AutoMapper;
using ECommerceAPI.Application.Features.Orders.OrderSpecs;
using ECommerceAPI.Application.Features.Products.ProductSpecs;
using ECommerceAPI.Application.Features.Products.Queries.GetList;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Interfaces.Brand;
using ECommerceAPI.Application.Interfaces.Order;
using ECommerceAPI.Application.Specification;
using ECommerceAPI.Domain.Entities;
using ECommerceAPI.Domain.Entities.Order;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Admin.Queries.GetList
{
    public class GetListAdminOrderQueryHandler : IRequestHandler<GetListAdminOrderQuery, List<GetListAdminOrderQueryResponse>>
    {
        private readonly IOrderReadRepository _orderReadRepository;
        private readonly IMapper _mapper;

        public GetListAdminOrderQueryHandler(IOrderReadRepository orderReadRepository, IMapper mapper)
        {
            _orderReadRepository = orderReadRepository;
            _mapper = mapper;
        }

        public async Task<List<GetListAdminOrderQueryResponse>> Handle(GetListAdminOrderQuery request, CancellationToken cancellationToken)
        {
            var spec = new OrderSpecification(request.SpecParams);
            var orders = await _orderReadRepository.ListAsync(spec);
            var count = await _orderReadRepository.CountAsync(spec);
            var pagination = new Pagination<Order>(request.SpecParams.PageIndex, request.SpecParams.PageSize, count, orders);
            var response = _mapper.Map<List<GetListAdminOrderQueryResponse>>(pagination.Data);

            return response;
        }
    }
}
