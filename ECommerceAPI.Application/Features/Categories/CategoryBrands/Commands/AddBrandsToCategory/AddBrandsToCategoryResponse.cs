namespace ECommerceAPI.Application.Features.Categories.CategoryBrands.Commands.AddBrandsToCategory
{
    public class AddBrandsToCategoryResponse
    {
        public Guid CategoryId { get; set; }
        public List<Guid> AddedBrandIds { get; set; } = new();
        public bool Success { get; set; }
        public string? Message { get; set; }
    }
}