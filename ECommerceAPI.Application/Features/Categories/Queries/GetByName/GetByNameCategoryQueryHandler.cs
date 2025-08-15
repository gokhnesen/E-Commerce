using AutoMapper;
using ECommerceAPI.Application.Features.Categories.Queries.GetById;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Categories.Queries.GetByName
{
    public class GetByNameCategoryQueryHandler : IRequestHandler<GetByNameCategoryQuery, GetByNameCategoryResponse>
    {
        private readonly ICategoryReadRepository _categoryReadRepository;
        private readonly IMapper _mapper;

        public GetByNameCategoryQueryHandler(ICategoryReadRepository categoryReadRepository, IMapper mapper)
        {
            _categoryReadRepository = categoryReadRepository;
            _mapper = mapper;
        }

        public async Task<GetByNameCategoryResponse> Handle(GetByNameCategoryQuery request, CancellationToken cancellationToken)
        {
            // Get the category with children using your repository method
            var categories = await _categoryReadRepository.GetCategoryWithChildrenAsync(request.Name);
            
            if (categories == null || !categories.Any())
                throw new Exception("Category not found");

            // Get the main category (first in the list)
            var category = categories.First();
            
            // Map the category to the response
            var response = _mapper.Map<GetByNameCategoryResponse>(category);
            
            // Get direct children only (where parent ID matches our category ID)
            var directChildren = categories
                .Where(c => c.ParentCategoryId == category.Id)
                .ToList();
            
            // Map the children using AutoMapper
            response.SubCategories = _mapper.Map<List<ChildCategoryDto>>(directChildren);
            
            return response;
        }
    }
}