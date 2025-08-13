using AutoMapper;
using ECommerceAPI.Application.Features.Categories.CategoryBrands.Queries.GetById;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Interfaces.BrandCategory;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Categories.Queries.GetBrands
{
    public class GetByIdCategoryBrandQueryHandler : IRequestHandler<GetByIdCategoryBrandQuery, GetByIdCategoryBrandResponse>
    {
        private readonly ICategoryReadRepository _categoryReadRepository;
        private readonly ICategoryBrandReadRepository _categoryBrandReadRepository;
        private readonly IMapper _mapper;

        public GetByIdCategoryBrandQueryHandler(
            ICategoryReadRepository categoryReadRepository,
            ICategoryBrandReadRepository categoryBrandReadRepository,
            IMapper mapper)
        {
            _categoryReadRepository = categoryReadRepository;
            _categoryBrandReadRepository = categoryBrandReadRepository;
            _mapper = mapper;
        }

        public async Task<GetByIdCategoryBrandResponse> Handle(GetByIdCategoryBrandQuery request, CancellationToken cancellationToken)
        {
            var category = await _categoryReadRepository.GetByIdAsync(request.CategoryId);

            if (category == null)
                throw new Exception($"Category with id {request.CategoryId} not found");
            var response = _mapper.Map<GetByIdCategoryBrandResponse>(category);

            var categoryBrands = await _categoryBrandReadRepository
                .GetWhere(cb => cb.CategoryId == request.CategoryId, tracking: false)
                .Include(cb => cb.Brand)
                .ToListAsync(cancellationToken);

            response.Brands = _mapper.Map<List<GetByIdCategoryBrandResponse.BrandDto>>(
                categoryBrands.Select(cb => cb.Brand));

            return response;
        }
    }
}