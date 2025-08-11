using AutoMapper;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Interfaces.Brand;
using ECommerceAPI.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;
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
        private readonly IBrandReadRepository _brandReadRepository;

        public UpdateProductCommandHandler(IProductWriteRepository productWriteRepository, IProductReadRepository productReadRepository, IMapper mapper, ICategoryReadRepository categoryReadRepository, IBrandReadRepository brandReadRepository)
        {
            _productWriteRepository = productWriteRepository;
            _productReadRepository = productReadRepository;
            _mapper = mapper;
            _categoryReadRepository = categoryReadRepository;
            _brandReadRepository = brandReadRepository;
        }

        public async Task<UpdateProductResponse> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            // Validate request
            if (request == null)
                throw new ArgumentNullException(nameof(request), "Güncelleme bilgileri boş olamaz.");
            
            if (request.Id == Guid.Empty)
                throw new ArgumentException("Ürün ID'si geçerli değil.", nameof(request.Id));
            
            // Get existing product
            var product = await _productReadRepository.GetByIdAsync(request.Id);
            if (product == null)
                throw new ArgumentException($"ID: {request.Id} olan ürün bulunamadı.");

           
                // Process category if provided
                if (!string.IsNullOrEmpty(request.CategoryName))
                {
                    var category = await _categoryReadRepository.GetSingleAsync(c => c.Name == request.CategoryName);
                    if (category == null)
                        throw new ArgumentException($"'{request.CategoryName}' isimli kategori bulunamadı.");
                    
                    product.CategoryId = category.Id;
                }
                
                // Process brand if provided
                if (!string.IsNullOrEmpty(request.BrandName))
                {
                    var brand = await _brandReadRepository.GetSingleAsync(b => b.Name == request.BrandName);
                    if (brand == null)
                        throw new ArgumentException($"'{request.BrandName}' isimli marka bulunamadı.");
                    
                    product.BrandId = brand.Id;
                }
                
                // Use AutoMapper to apply updates, ignoring null values
                _mapper.Map(request, product);
                
                // Ensure navigation properties are null to prevent creating new entities
                product.Brand = null;
                product.Category = null;
                
                // Save changes
                _productWriteRepository.Update(product);
                await _productWriteRepository.SaveAsync();
                
                
                // Create response
                var response = _mapper.Map<UpdateProductResponse>(product);
                
                // Add category and brand names
                if (product.CategoryId != Guid.Empty)
                {
                    var category = await _categoryReadRepository.GetByIdAsync(product.CategoryId);
                    if (category != null)
                        response.CategoryName = category.Name;
                }
                
                if (product.BrandId != Guid.Empty)
                {
                    var brand = await _brandReadRepository.GetByIdAsync(product.BrandId);
                    if (brand != null)
                        response.BrandName = brand.Name;
                }
                
                return response;
            }
        }
    }

