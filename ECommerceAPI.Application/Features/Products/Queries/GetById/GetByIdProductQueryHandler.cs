using AutoMapper;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Products.Queries.GetById
{
    public class GetByIdProductQueryHandler : IRequestHandler<GetByIdProductQuery, GetByIdProductQueryResponse>
    {
        private readonly IMapper _mapper;
        private readonly IProductReadRepository _productReadRepository;
        private readonly ICategoryReadRepository _categoryReadRepository;

        public GetByIdProductQueryHandler(IMapper mapper, IProductReadRepository productReadRepository, ICategoryReadRepository categoryReadRepository)
        {
            _mapper = mapper;
            _productReadRepository = productReadRepository;
            _categoryReadRepository = categoryReadRepository;
        }

        public async Task<GetByIdProductQueryResponse> Handle(GetByIdProductQuery request, CancellationToken cancellationToken)
        {
            Product product = await _productReadRepository.GetByIdAsync(request.Id);
            if (product == null)
                throw new Exception("Product not found");

            Category category = await _categoryReadRepository.GetByIdAsync(product.CategoryId);

            GetByIdProductQueryResponse response = _mapper.Map<GetByIdProductQueryResponse>(product);
            response.CategoryName = category?.Name;

            return response;
        }
    }
}
