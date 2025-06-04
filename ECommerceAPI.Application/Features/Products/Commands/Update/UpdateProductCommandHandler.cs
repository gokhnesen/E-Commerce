using AutoMapper;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Products.Commands.Update
{
    public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, UpdateProductResponse>
    {
        private readonly IProductWriteRepository _productWriteRepository;
        private readonly IProductReadRepository _productReadRepository;
        private readonly IMapper _mapper;
        private readonly ICategoryReadRepository _categoryReadRepository;

        public UpdateProductCommandHandler(IProductWriteRepository productWriteRepository, IProductReadRepository productReadRepository, IMapper mapper, ICategoryReadRepository categoryReadRepository)
        {
            _productWriteRepository = productWriteRepository;
            _productReadRepository = productReadRepository;
            _mapper = mapper;
            _categoryReadRepository = categoryReadRepository;
        }

        public async Task<UpdateProductResponse>? Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            Product? product = await _productReadRepository.GetByIdAsync(request.Id);
            product = _mapper.Map(request, product);

            _productWriteRepository.Update(product);
            _productWriteRepository.SaveAsync();
            UpdateProductResponse response = _mapper.Map<UpdateProductResponse>(product);
            return response;
        }
    }
}
