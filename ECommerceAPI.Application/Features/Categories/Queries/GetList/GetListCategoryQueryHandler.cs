using AutoMapper;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Domain.Entities;
using MediatR;

namespace ECommerceAPI.Application.Features.Categories.Queries.GetList
{
    public class GetListCategoryQueryHandler : IRequestHandler<GetListCategoryQuery, List<GetListCategoryResponse>>
    {
        private readonly ICategoryReadRepository _categoryReadRepository;
        private readonly IMapper _mapper;

        public GetListCategoryQueryHandler(ICategoryReadRepository categoryReadRepository, IMapper mapper)
        {
            _categoryReadRepository = categoryReadRepository;
            _mapper = mapper;
        }

        public async Task<List<GetListCategoryResponse>> Handle(GetListCategoryQuery request, CancellationToken cancellationToken)
        {
            var categories = _categoryReadRepository.GetAll().ToList();
            var response = _mapper.Map<List<GetListCategoryResponse>>(categories);
            return response;
        }
    }
} 