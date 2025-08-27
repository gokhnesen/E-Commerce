using ECommerceAPI.Application.Interfaces.BrandCategory;
using ECommerceAPI.Domain.Entities;
using MediatR;

namespace ECommerceAPI.Application.Features.Categories.CategoryBrands.Commands.AddBrandsToCategory
{
    public class AddBrandsToCategoryCommandHandler : IRequestHandler<AddBrandsToCategoryCommand, AddBrandsToCategoryResponse>
    {
        private readonly ICategoryBrandWriteRepository _categoryBrandWriteRepository;

        public AddBrandsToCategoryCommandHandler(ICategoryBrandWriteRepository categoryBrandWriteRepository)
        {
            _categoryBrandWriteRepository = categoryBrandWriteRepository;
        }

        public async Task<AddBrandsToCategoryResponse> Handle(AddBrandsToCategoryCommand request, CancellationToken cancellationToken)
        {
            var addedBrandIds = new List<Guid>();

            foreach (var brandId in request.BrandIds)
            {
                var categoryBrand = new CategoryBrand
                {
                    CategoryId = request.CategoryId,
                    BrandId = brandId
                };
                await _categoryBrandWriteRepository.AddAsync(categoryBrand);
                addedBrandIds.Add(brandId);
            }
            await _categoryBrandWriteRepository.SaveAsync();

            return new AddBrandsToCategoryResponse
            {
                CategoryId = request.CategoryId,
                AddedBrandIds = addedBrandIds,
                Success = true,
                Message = "Markalar kategoriye ba?ar?yla eklendi."
            };
        }
    }
}