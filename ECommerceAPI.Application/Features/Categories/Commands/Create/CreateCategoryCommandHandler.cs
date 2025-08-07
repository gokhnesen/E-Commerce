using AutoMapper;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Domain.Entities;
using MediatR;

namespace ECommerceAPI.Application.Features.Categories.Commands.Create
{
    public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, CreateCategoryResponse>
    {
        private readonly ICategoryWriteRepository _categoryWriteRepository;
        private readonly ICategoryReadRepository _categoryReadRepository;
        private readonly IMapper _mapper;

        public CreateCategoryCommandHandler(ICategoryWriteRepository categoryWriteRepository, ICategoryReadRepository categoryReadRepository, IMapper mapper)
        {
            _categoryWriteRepository = categoryWriteRepository;
            _categoryReadRepository = categoryReadRepository;
            _mapper = mapper;
        }

        public async Task<CreateCategoryResponse> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            Category category = _mapper.Map<Category>(request);
            category.Id = Guid.NewGuid();
            
            await _categoryWriteRepository.AddAsync(category);
            await _categoryWriteRepository.SaveAsync();

            CreateCategoryResponse response = _mapper.Map<CreateCategoryResponse>(category);
            response.ParentCategoryName = request.ParentCategoryId.HasValue 
                ? (await _categoryReadRepository.GetByIdAsync(request.ParentCategoryId.Value))?.Name 
                : null;
            return response;
        }
    }
} 