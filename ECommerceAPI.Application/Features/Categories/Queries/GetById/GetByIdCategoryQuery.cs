using MediatR;

namespace ECommerceAPI.Application.Features.Categories.Queries.GetById
{
    public class GetByIdCategoryQuery : IRequest<GetByIdCategoryResponse>
    {
        public string Id { get; set; }
    }
} 