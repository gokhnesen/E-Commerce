using AutoMapper;
using ECommerceAPI.Application.Interfaces.Brand;
using ECommerceAPI.Domain.Entities;
using MediatR;

namespace ECommerceAPI.Application.Features.Brands.Commands.Create
{
    public class CreateBrandCommandHandler : IRequestHandler<CreateBrandCommand, CreateBrandResponse>
    {
        private readonly IBrandWriteRepository _brandWriteRepository;
        private readonly IBrandReadRepository _brandReadRepository;
        private readonly IMapper _mapper;

        public CreateBrandCommandHandler(
            IBrandWriteRepository brandWriteRepository,
            IBrandReadRepository brandReadRepository,
            IMapper mapper)
        {
            _brandWriteRepository = brandWriteRepository;
            _brandReadRepository = brandReadRepository;
            _mapper = mapper;
        }

        public async Task<CreateBrandResponse> Handle(CreateBrandCommand request, CancellationToken cancellationToken)
        {
            var existingBrand = await _brandReadRepository.GetSingleAsync(b => b.Name == request.Name);
            if (existingBrand != null)
            {
                throw new Exception($"'{request.Name}' isimli marka zaten mevcut.");
            }

            Brand brand = _mapper.Map<Brand>(request);
            brand.Id = Guid.NewGuid();

            await _brandWriteRepository.AddAsync(brand);
            await _brandWriteRepository.SaveAsync();

            CreateBrandResponse response = _mapper.Map<CreateBrandResponse>(brand);
            return response;
        }
    }
}