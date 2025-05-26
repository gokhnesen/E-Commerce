using AutoMapper;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Products.Commands.Create
{
    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, CreateProductResponse>
    {
        private readonly IProductWriteRepository _productWriteRepository;
        private readonly IMapper _mapper;

        public async Task<CreateProductResponse>? Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            Product product = _mapper.Map<Product>(request);
            product.Id = Guid.NewGuid();
            await _productWriteRepository.AddAsync(product);

            CreateProductResponse createProductResponse = _mapper.Map<CreateProductResponse>(product);
            return createProductResponse;
        }
    }
}
