using AutoMapper;
using ECommerceAPI.Application.Interfaces.Brand;
using MediatR;

namespace ECommerceAPI.Application.Features.Brands.Commands.Update
{
    public class UpdateBrandCommandHandler : IRequestHandler<UpdateBrandCommand, UpdateBrandResponse>
    {
        private readonly IBrandReadRepository _brandReadRepository;
        private readonly IBrandWriteRepository _brandWriteRepository;
        private readonly IMapper _mapper;

        public UpdateBrandCommandHandler(IBrandReadRepository brandReadRepository, IBrandWriteRepository brandWriteRepository, IMapper mapper)
        {
            _brandReadRepository = brandReadRepository;
            _brandWriteRepository = brandWriteRepository;
            _mapper = mapper;
        }

        public async Task<UpdateBrandResponse> Handle(UpdateBrandCommand request, CancellationToken cancellationToken)
        {
            var brand = await _brandReadRepository.GetByIdAsync(request.Id);
            if (brand == null)
                throw new Exception($"Brand not found with ID: {request.Id}");

            brand.Name = request.Name;

            _brandWriteRepository.Update(brand);
            await _brandWriteRepository.SaveAsync();

            UpdateBrandResponse response = _mapper.Map<UpdateBrandResponse>(brand);
            return response;
        }
    }
} 