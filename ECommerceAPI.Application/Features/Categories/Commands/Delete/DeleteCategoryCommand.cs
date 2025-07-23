using MediatR;

namespace ECommerceAPI.Application.Features.Categories.Commands.Delete
{
    public class DeleteCategoryCommand : IRequest<DeleteCategoryResponse>
    {
        public string Id { get; set; }
    }
} 