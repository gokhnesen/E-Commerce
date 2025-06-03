using AutoMapper;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Products.Commands.Delete
{
    public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand,DeleteProductResponse>
    {
        private readonly IProductWriteRepository _productWriteRepository;
        private readonly IProductReadRepository _productReadRepository;
        private readonly IMapper _mapper;

        public DeleteProductCommandHandler(IProductWriteRepository productWriteRepository, IProductReadRepository productReadRepository, IMapper mapper)
        {
            _productWriteRepository = productWriteRepository;
            _productReadRepository = productReadRepository;
            _mapper = mapper;
        }

        public async Task<DeleteProductResponse> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
        {
            Product product = await _productReadRepository.GetByIdAsync(request.Id);
            product = _mapper.Map(request, product);
            
            _productWriteRepository.Remove(product);

            DeleteProductResponse response = _mapper.Map<DeleteProductResponse>(product);
            return response;

        }
    }
}
