using AutoMapper;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Domain.Entities;
using MediatR;

namespace ECommerceAPI.Application.Features.Categories.Commands.Delete
{
    public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, DeleteCategoryResponse>
    {
        private readonly ICategoryWriteRepository _categoryWriteRepository;
        private readonly ICategoryReadRepository _categoryReadRepository;
        private readonly IMapper _mapper;

        public DeleteCategoryCommandHandler(ICategoryWriteRepository categoryWriteRepository, ICategoryReadRepository categoryReadRepository, IMapper mapper)
        {
            _categoryWriteRepository = categoryWriteRepository;
            _categoryReadRepository = categoryReadRepository;
            _mapper = mapper;
        }

        public async Task<DeleteCategoryResponse> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            Category category = await _categoryReadRepository.GetByIdAsync(request.Id);
            if (category == null)
                throw new Exception("Category not found");

            _categoryWriteRepository.Remove(category);
            await _categoryWriteRepository.SaveAsync();

            DeleteCategoryResponse response = _mapper.Map<DeleteCategoryResponse>(category);
            return response;
        }
    }
} 