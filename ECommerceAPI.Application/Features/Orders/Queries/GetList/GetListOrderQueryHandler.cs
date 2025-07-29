using AutoMapper;
using ECommerceAPI.Application.Extensions;
using ECommerceAPI.Application.Features.Orders.OrderSpecs;
using ECommerceAPI.Application.Interfaces.Order;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace ECommerceAPI.Application.Features.Orders.Queries.GetList
{
    public class GetListOrderQueryHandler : IRequestHandler<GetListOrderQuery, List<GetListOrderQueryResponse>>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IOrderReadRepository _orderReadRepository;
        private readonly IMapper _mapper;

        public GetListOrderQueryHandler(IHttpContextAccessor contextAccessor, IOrderReadRepository orderReadRepository, IMapper mapper)
        {
            _contextAccessor = contextAccessor;
            _orderReadRepository = orderReadRepository;
            _mapper = mapper;
        }

        public async Task<List<GetListOrderQueryResponse>> Handle(GetListOrderQuery request, CancellationToken cancellationToken)
        {
            var spec = new OrderSpecification(_contextAccessor.HttpContext.User.GetEmail());
            var orders = await _orderReadRepository.ListAsync(spec);
            
            var response = _mapper.Map<List<GetListOrderQueryResponse>>(orders);
            return response;
        }
    }
}