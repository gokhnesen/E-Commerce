using MediatR;

namespace ECommerceAPI.Application.Features.Categories.Queries.GetByName
{
    public class GetByNameCategoryQuery : IRequest<GetByNameCategoryResponse>
    {
        public string Name { get; set; }
    }
}