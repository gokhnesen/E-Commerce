using AutoMapper;
using ECommerceAPI.Application.Features.Products.ProductSpecs;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Interfaces.Brand;
using ECommerceAPI.Domain.Entities;
using MediatR;

namespace ECommerceAPI.Application.Features.Products.Queries.GetList
{
    public class GetListProductQueryHandler : IRequestHandler<GetListProductQuery, List<GetListProductQueryResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IProductReadRepository _productReadRepository;
        private readonly ICategoryReadRepository _categoryReadRepository;
        private readonly IBrandReadRepository _brandReadRepository;

        public GetListProductQueryHandler(IMapper mapper, IProductReadRepository productReadRepository, ICategoryReadRepository categoryReadRepository, IBrandReadRepository brandReadRepository)
        {
            _mapper = mapper;
            _productReadRepository = productReadRepository;
            _categoryReadRepository = categoryReadRepository;
            _brandReadRepository = brandReadRepository;
        }

        public async Task<List<GetListProductQueryResponse>> Handle(GetListProductQuery request, CancellationToken cancellationToken)
        {
            var spec = new ProductSpecification(request.SpecParams);
            var products = await _productReadRepository.ListAsync(spec);
            var response = _mapper.Map<List<GetListProductQueryResponse>>(products);

            foreach (var item in response)
            {
                var product = products.FirstOrDefault(p => p.Id == item.Id);
                if (product != null)
                {
                    var category = await _categoryReadRepository.GetByIdAsync(product.CategoryId);
                    var brand = await _brandReadRepository.GetByIdAsync(product.BrandId);

                    if (category != null)
                        item.CategoryName = category.Name;

                    if (brand != null)
                        item.BrandName = brand.Name;
                }
            }

            return response;
        }

    }
}