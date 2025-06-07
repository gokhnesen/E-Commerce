using MediatR;

namespace ECommerceAPI.Application.Features.Categories.Commands.Create
{
    public class CreateCategoryCommand : IRequest<CreateCategoryResponse>
    {
        public string Name { get; set; }
    }
} 