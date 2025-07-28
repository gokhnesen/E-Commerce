using AutoMapper;
using ECommerceAPI.Application.Extensions;
using ECommerceAPI.Application.Features.Orders.OrderSpecs;
using ECommerceAPI.Application.Features.Products.Queries.GetById;
using ECommerceAPI.Application.Interfaces.Order;
using ECommerceAPI.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Orders.Queries
{
    public class GetByIdOrderQueryHandler : IRequestHandler<GetByIdOrderQuery, GetByIdOrderQueryResponse>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IOrderReadRepository _orderReadRepository;
        private readonly IMapper _mapper;

        public GetByIdOrderQueryHandler(IHttpContextAccessor contextAccessor, IOrderReadRepository orderReadRepository, IMapper mapper)
        {
            _contextAccessor = contextAccessor;
            _orderReadRepository = orderReadRepository;
            _mapper = mapper;
        }

        public async Task<GetByIdOrderQueryResponse> Handle(GetByIdOrderQuery request, CancellationToken cancellationToken)
        {
            var spec = new OrderSpecification(_contextAccessor.HttpContext.User.GetEmail());
            var orders = await _orderReadRepository.GetEntityWithSpec(spec);

            GetByIdOrderQueryResponse response = _mapper.Map<GetByIdOrderQueryResponse>(orders);
            return response;
        }
    }
}
