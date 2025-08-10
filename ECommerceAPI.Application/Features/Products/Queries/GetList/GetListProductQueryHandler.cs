using AutoMapper;
using ECommerceAPI.Application.Features.Products.ProductSpecs;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Interfaces.Brand;
using ECommerceAPI.Application.Specification;
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
            List<string> allCategoryNames = null;
            if (request.SpecParams.Categories.Count > 0)
            {
                allCategoryNames = new List<string>();
                foreach (var categoryName in request.SpecParams.Categories)
                {
                    var categoriesWithChildren = await _categoryReadRepository.GetCategoryWithChildrenAsync(categoryName);
                    allCategoryNames.AddRange(categoriesWithChildren.Select(c => c.Name));
                }
                allCategoryNames = allCategoryNames.Distinct().ToList();
            }

            var spec = new ProductSpecification(request.SpecParams, allCategoryNames);
            var products = await _productReadRepository.ListAsync(spec);
            var count = await _productReadRepository.CountAsync(spec);
            var pagination = new Pagination<Product>(request.SpecParams.PageIndex, request.SpecParams.PageSize, count, products);
            var response = _mapper.Map<List<GetListProductQueryResponse>>(pagination.Data);

            foreach (var item in response)
            {
                var product = products.FirstOrDefault(p => p.Id == Guid.Parse(item.Id));
                if (product != null)
                {
                    var category = await _categoryReadRepository.GetByIdAsync(product.CategoryId);
                    var brand = await _brandReadRepository.GetByIdAsync(product.BrandId);

                    if (category != null)
                        item.Category = category.Name;

                    if (brand != null)
                        item.Brand = brand.Name;
                }
            }

            return response;
        }

    }
}