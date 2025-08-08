using ECommerceAPI.Application.Features.Products;
using ECommerceAPI.Application.Features.Products.ProductSpecs;
using MediatR;

namespace ECommerceAPI.Application.Features.Products.Queries.GetList
{
    public class GetListProductQuery : IRequest<List<GetListProductQueryResponse>>
    {
        public ProductSpecParams? SpecParams { get; set; }
        public GetListProductQuery(ProductSpecParams specParams)
        {
            SpecParams = specParams ?? new ProductSpecParams();
        }

    }
} 