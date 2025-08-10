using AutoMapper;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Interfaces.Brand;
using ECommerceAPI.Domain.Entities;
using MediatR;

namespace ECommerceAPI.Application.Features.Products.Commands.Create
{
    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, CreateProductResponse>
    {
        private readonly IProductWriteRepository _productWriteRepository;
        private readonly IMapper _mapper;
        private readonly ICategoryReadRepository _categoryReadRepository;
        private readonly IBrandReadRepository _brandReadRepository;

        public CreateProductCommandHandler(
            IProductWriteRepository productWriteRepository,
            IMapper mapper,
            ICategoryReadRepository categoryReadRepository,
            IBrandReadRepository brandReadRepository)
        {
            _productWriteRepository = productWriteRepository;
            _mapper = mapper;
            _categoryReadRepository = categoryReadRepository;
            _brandReadRepository = brandReadRepository;
        }

        public async Task<CreateProductResponse>? Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var category = await _categoryReadRepository.GetSingleAsync(c => c.Name == request.CategoryName);
            if (category == null)
            {
                throw new ArgumentException($"'{request.CategoryName}' isimli kategori bulunamadı.");
            }

            if (string.IsNullOrEmpty(request.BrandName))
            {
                throw new ArgumentException("Marka adı belirtilmedi.");
            }

            var brand = await _brandReadRepository.GetSingleAsync(b => b.Name == request.BrandName);
            if (brand == null)
            {
                throw new ArgumentException($"'{request.BrandName}' isimli marka bulunamadı.");
            }

            Product product = _mapper.Map<Product>(request);

            product.CategoryId = category.Id;
            product.BrandId = brand.Id;
            product.Id = Guid.NewGuid();

            product.Brand = null;
            product.Category = null;

            await _productWriteRepository.AddAsync(product);
            await _productWriteRepository.SaveAsync();

            CreateProductResponse createProductResponse = _mapper.Map<CreateProductResponse>(product);
            createProductResponse.CategoryName = category.Name;
            createProductResponse.BrandName = brand.Name;

            return createProductResponse;
        }
    }
}