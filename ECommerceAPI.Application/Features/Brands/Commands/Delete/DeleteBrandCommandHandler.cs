using AutoMapper;
using ECommerceAPI.Application.Interfaces.Brand;
using MediatR;

namespace ECommerceAPI.Application.Features.Brands.Commands.Delete
{
    public class DeleteBrandCommandHandler : IRequestHandler<DeleteBrandCommand, DeleteBrandResponse>
    {
        private readonly IBrandReadRepository _brandReadRepository;
        private readonly IBrandWriteRepository _brandWriteRepository;
        private readonly IMapper _mapper;

        public DeleteBrandCommandHandler(IBrandReadRepository brandReadRepository, IBrandWriteRepository brandWriteRepository, IMapper mapper)
        {
            _brandReadRepository = brandReadRepository;
            _brandWriteRepository = brandWriteRepository;
            _mapper = mapper;
        }

        public async Task<DeleteBrandResponse> Handle(DeleteBrandCommand request, CancellationToken cancellationToken)
        {
            var brand = await _brandReadRepository.GetByIdAsync(request.Id);
            if (brand == null)
                throw new Exception($"Brand not found with ID: {request.Id}");

            await _brandWriteRepository.RemoveAsync(request.Id.ToString());
            await _brandWriteRepository.SaveAsync();

            DeleteBrandResponse response = _mapper.Map<DeleteBrandResponse>(brand);
            return response;
        }
    }
} 