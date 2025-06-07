using MediatR;

namespace ECommerceAPI.Application.Features.Products.Queries.GetList
{
    public class GetListProductQuery : IRequest<List<GetListProductQueryResponse>>
    {
    }
} 