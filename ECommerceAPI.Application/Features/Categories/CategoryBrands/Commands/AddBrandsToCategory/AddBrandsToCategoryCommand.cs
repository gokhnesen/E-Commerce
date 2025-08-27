using MediatR;

namespace ECommerceAPI.Application.Features.Categories.CategoryBrands.Commands.AddBrandsToCategory
{
    public class AddBrandsToCategoryCommand : IRequest<AddBrandsToCategoryResponse>
    {
        public Guid CategoryId { get; set; }
        public List<Guid> BrandIds { get; set; } = new();
    }
}