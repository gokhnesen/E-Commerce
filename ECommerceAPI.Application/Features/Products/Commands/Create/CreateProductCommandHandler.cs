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
        private readonly ICategoryReadRepository _categoryReadRepository;

        public CreateProductCommandHandler(IProductWriteRepository productWriteRepository, IMapper mapper, ICategoryReadRepository categoryReadRepository)
        {
            _productWriteRepository = productWriteRepository;
            _mapper = mapper;
            _categoryReadRepository = categoryReadRepository;
        }

        public async Task<CreateProductResponse>? Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var category = await _categoryReadRepository.GetSingleAsync(c => c.Name == request.CategoryName);
            
            if (category == null)
            {
                throw new ArgumentException($"'{request.CategoryName}' isimli kategori bulunamadı.");
            }

            Product product = _mapper.Map<Product>(request);
            product.CategoryId = category.Id;
            product.Id = Guid.NewGuid();
            await _productWriteRepository.AddAsync(product);
            await _productWriteRepository.SaveAsync();

            CreateProductResponse createProductResponse = _mapper.Map<CreateProductResponse>(product);
            createProductResponse.CategoryName = category.Name;

            return createProductResponse;
        }
    }
}
