using AutoMapper;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Domain.Entities;
using MediatR;

namespace ECommerceAPI.Application.Features.Categories.Commands.Update
{
    public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, UpdateCategoryResponse>
    {
        private readonly ICategoryWriteRepository _categoryWriteRepository;
        private readonly ICategoryReadRepository _categoryReadRepository;
        private readonly IMapper _mapper;

        public UpdateCategoryCommandHandler(ICategoryWriteRepository categoryWriteRepository, ICategoryReadRepository categoryReadRepository, IMapper mapper)
        {
            _categoryWriteRepository = categoryWriteRepository;
            _categoryReadRepository = categoryReadRepository;
            _mapper = mapper;
        }

        public async Task<UpdateCategoryResponse> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            Category category = await _categoryReadRepository.GetByIdAsync(request.Id);
            if (category == null)
                throw new Exception("Category not found");

            category = _mapper.Map(request, category);
            _categoryWriteRepository.Update(category);
            await _categoryWriteRepository.SaveAsync();

            UpdateCategoryResponse response = _mapper.Map<UpdateCategoryResponse>(category);
            return response;
        }
    }
} 