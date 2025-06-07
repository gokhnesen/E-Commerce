using AutoMapper;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Domain.Entities;
using MediatR;

namespace ECommerceAPI.Application.Features.Products.Queries.GetList
{
    public class GetListProductQueryHandler : IRequestHandler<GetListProductQuery, List<GetListProductQueryResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IProductReadRepository _productReadRepository;
        private readonly ICategoryReadRepository _categoryReadRepository;

        public GetListProductQueryHandler(IMapper mapper, IProductReadRepository productReadRepository, ICategoryReadRepository categoryReadRepository)
        {
            _mapper = mapper;
            _productReadRepository = productReadRepository;
            _categoryReadRepository = categoryReadRepository;
        }

        public async Task<List<GetListProductQueryResponse>> Handle(GetListProductQuery request, CancellationToken cancellationToken)
        {
            var products = _productReadRepository.GetAll().ToList();
            var response = _mapper.Map<List<GetListProductQueryResponse>>(products);

            foreach (var item in response)
            {
                var product = products.FirstOrDefault(p => p.Id == item.Id);
                if (product != null)
                {
                    var category = await _categoryReadRepository.GetByIdAsync(product.CategoryId);
                    if (category != null)
                    {
                        item.CategoryName = category.Name;
                    }
                }
            }

            return response;
        }
    }
} 