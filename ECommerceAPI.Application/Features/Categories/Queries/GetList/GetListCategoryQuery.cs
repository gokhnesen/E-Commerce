using MediatR;

namespace ECommerceAPI.Application.Features.Categories.Queries.GetList
{
    public class GetListCategoryQuery : IRequest<List<GetListCategoryResponse>>
    {
    }
} 