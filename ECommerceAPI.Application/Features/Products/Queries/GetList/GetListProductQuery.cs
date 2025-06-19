using MediatR;

namespace ECommerceAPI.Application.Features.Products.Queries.GetList
{
    public class GetListProductQuery : IRequest<List<GetListProductQueryResponse>>
    {
        public string? Brand { get; set; }
        public string? Category { get; set; }

    }
} 