using AutoMapper;
using ECommerceAPI.Application.Interfaces.Brand;
using MediatR;

namespace ECommerceAPI.Application.Features.Brands.Queries.GetById
{
    public class GetByIdBrandQueryHandler : IRequestHandler<GetByIdBrandQuery, GetByIdBrandResponse>
    {
        private readonly IBrandReadRepository _brandReadRepository;
        private readonly IMapper _mapper;

        public GetByIdBrandQueryHandler(IBrandReadRepository brandReadRepository, IMapper mapper)
        {
            _brandReadRepository = brandReadRepository;
            _mapper = mapper;
        }

        public async Task<GetByIdBrandResponse> Handle(GetByIdBrandQuery request, CancellationToken cancellationToken)
        {
            var brand = await _brandReadRepository.GetByIdAsync(request.Id);
            GetByIdBrandResponse response = _mapper.Map<GetByIdBrandResponse>(brand);
            return response;
        }
    }
} 