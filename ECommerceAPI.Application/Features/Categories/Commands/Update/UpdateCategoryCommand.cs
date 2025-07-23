using MediatR;

namespace ECommerceAPI.Application.Features.Categories.Commands.Update
{
    public class UpdateCategoryCommand : IRequest<UpdateCategoryResponse>
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
} 