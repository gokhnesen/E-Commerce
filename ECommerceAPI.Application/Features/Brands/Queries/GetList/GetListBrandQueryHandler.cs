using AutoMapper;
using ECommerceAPI.Application.Interfaces.Brand;
using MediatR;

namespace ECommerceAPI.Application.Features.Brands.Queries.GetList
{
    public class GetListBrandQueryHandler : IRequestHandler<GetListBrandQuery, List<GetListBrandResponse>>
    {
        private readonly IBrandReadRepository _brandReadRepository;
        private readonly IMapper _mapper;

        public GetListBrandQueryHandler(IBrandReadRepository brandReadRepository, IMapper mapper)
        {
            _brandReadRepository = brandReadRepository;
            _mapper = mapper;
        }

        public async Task<List<GetListBrandResponse>> Handle(GetListBrandQuery request, CancellationToken cancellationToken)
        {
            var brands = _brandReadRepository.GetAll()
                .ToList();

            List<GetListBrandResponse> response = _mapper.Map<List<GetListBrandResponse>>(brands);
            return response;
        }
    }
} 