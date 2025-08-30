using ECommerceAPI.Application.Interfaces.BrandCategory;
using ECommerceAPI.Application.Interfaces.Brand;
using ECommerceAPI.Domain.Entities;
using MediatR;
using ECommerceAPI.Application.Interfaces;

namespace ECommerceAPI.Application.Features.Categories.CategoryBrands.Commands.AddBrandsToCategory
{
    public class AddBrandsToCategoryCommandHandler : IRequestHandler<AddBrandsToCategoryCommand, AddBrandsToCategoryResponse>
    {
        private readonly ICategoryBrandWriteRepository _categoryBrandWriteRepository;
        private readonly ICategoryReadRepository _categoryReadRepository;
        private readonly IBrandReadRepository _brandReadRepository;
    
        public AddBrandsToCategoryCommandHandler(
            ICategoryBrandWriteRepository categoryBrandWriteRepository,
            ICategoryReadRepository categoryReadRepository,
            IBrandReadRepository brandReadRepository)
        {
            _categoryBrandWriteRepository = categoryBrandWriteRepository;
            _categoryReadRepository = categoryReadRepository;
            _brandReadRepository = brandReadRepository;
        }

        public async Task<AddBrandsToCategoryResponse> Handle(AddBrandsToCategoryCommand request, CancellationToken cancellationToken)
        {
            // Category varl???n? kontrol et
            var category = await _categoryReadRepository.GetByIdAsync(request.CategoryId);
            if (category == null)
            {
                return new AddBrandsToCategoryResponse
                {
                    Success = false,
                    Message = $"Kategori bulunamad?: {request.CategoryId}",
                    CategoryId = request.CategoryId,
                    AddedBrandIds = new List<Guid>()
                };
            }

            var addedBrandIds = new List<Guid>();

            foreach (var brandId in request.BrandIds)
            {
                var brand = await _brandReadRepository.GetByIdAsync(brandId);
                if (brand == null)
                {
                    // ?sterseniz burada hata f?rlat?n; ben atlay?p loglayacak ?ekilde b?rakt?m
                    // Logger yoksa geriye dönen mesajta eksikler bildirilebilir
                    continue;
                }

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