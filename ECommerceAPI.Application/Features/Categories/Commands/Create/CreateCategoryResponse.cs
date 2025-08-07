using ECommerceAPI.Domain.Entities;

namespace ECommerceAPI.Application.Features.Categories.Commands.Create
{
    public class CreateCategoryResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid? ParentCategoryId { get; set; }
        public string? ParentCategoryName { get; set; }
    }
} 