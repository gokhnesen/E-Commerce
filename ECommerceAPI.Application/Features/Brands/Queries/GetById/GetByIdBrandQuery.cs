using MediatR;

namespace ECommerceAPI.Application.Features.Brands.Queries.GetById
{
    public class GetByIdBrandQuery : IRequest<GetByIdBrandResponse>
    {
        public string Id { get; set; }
    }
} 