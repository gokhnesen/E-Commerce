using AutoMapper;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Domain.Entities;
using MediatR;

namespace ECommerceAPI.Application.Features.Categories.Queries.GetById
{
    public class GetByIdCategoryQueryHandler : IRequestHandler<GetByIdCategoryQuery, GetByIdCategoryResponse>
    {
        private readonly ICategoryReadRepository _categoryReadRepository;
        private readonly IMapper _mapper;

        public GetByIdCategoryQueryHandler(ICategoryReadRepository categoryReadRepository, IMapper mapper)
        {
            _categoryReadRepository = categoryReadRepository;
            _mapper = mapper;
        }

        public async Task<GetByIdCategoryResponse> Handle(GetByIdCategoryQuery request, CancellationToken cancellationToken)
        {
            Category category = await _categoryReadRepository.GetByIdAsync(request.Id);
            if (category == null)
                throw new Exception("Category not found");

            GetByIdCategoryResponse response = _mapper.Map<GetByIdCategoryResponse>(category);
            return response;
        }
    }
} 