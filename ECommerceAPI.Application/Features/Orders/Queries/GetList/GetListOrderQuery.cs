using MediatR;

namespace ECommerceAPI.Application.Features.Orders.Queries.GetList
{
    public class GetListOrderQuery : IRequest<List<GetListOrderQueryResponse>>
    {
        // Empty as we'll get all orders for the current user
    }
}