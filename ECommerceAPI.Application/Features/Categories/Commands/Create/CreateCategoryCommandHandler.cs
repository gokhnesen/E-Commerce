using AutoMapper;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Domain.Entities;
using MediatR;

namespace ECommerceAPI.Application.Features.Categories.Commands.Create
{
    public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, CreateCategoryResponse>
    {
        private readonly ICategoryWriteRepository _categoryWriteRepository;
        private readonly IMapper _mapper;

        public CreateCategoryCommandHandler(ICategoryWriteRepository categoryWriteRepository, IMapper mapper)
        {
            _categoryWriteRepository = categoryWriteRepository;
            _mapper = mapper;
        }

        public async Task<CreateCategoryResponse> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            Category category = _mapper.Map<Category>(request);
            category.Id = Guid.NewGuid();
            
            await _categoryWriteRepository.AddAsync(category);
            await _categoryWriteRepository.SaveAsync();

            CreateCategoryResponse response = _mapper.Map<CreateCategoryResponse>(category);
            return response;
        }
    }
} 