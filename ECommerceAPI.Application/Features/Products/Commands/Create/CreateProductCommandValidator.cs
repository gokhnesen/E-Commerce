using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Interfaces.Brand;
using FluentValidation;

namespace ECommerceAPI.Application.Features.Products.Commands.Create
{
    public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
    {
        private readonly IProductReadRepository _productReadRepository;
        private readonly ICategoryReadRepository _categoryReadRepository;
        private readonly IBrandReadRepository _brandReadRepository;

        public CreateProductCommandValidator(
            IProductReadRepository productReadRepository,
            ICategoryReadRepository categoryReadRepository,
            IBrandReadRepository brandReadRepository)
        {
            _productReadRepository = productReadRepository;
            _categoryReadRepository = categoryReadRepository;
            _brandReadRepository = brandReadRepository;

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Ürün adı boş olamaz.")
                .MaximumLength(200).WithMessage("Ürün adı en fazla 200 karakter olabilir.")
                .MustAsync(async (name, cancellation) =>
                {
                    var existingProduct = await _productReadRepository.GetSingleAsync(p => p.Name == name);
                    return existingProduct == null;
                }).WithMessage(x => $"'{x.Name}' isimli ürün zaten mevcut.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Ürün açıklaması boş olamaz.")
                .MaximumLength(2000).WithMessage("Ürün açıklaması en fazla 2000 karakter olabilir.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Ürün fiyatı 0'dan büyük olmalıdır.");

            RuleFor(x => x.Stock)
                .GreaterThanOrEqualTo(0).WithMessage("Stok miktarı negatif olamaz.");

            RuleFor(x => x.CategoryName)
                .NotEmpty().WithMessage("Kategori adı belirtilmesi zorunludur.");

            RuleFor(x => x.BrandName)
                .NotEmpty().WithMessage("Marka adı belirtilmesi zorunludur.");

            When(x => x.PictureUrl != null, () =>
            {
                RuleFor(x => x.PictureUrl)
                    .MaximumLength(1000).WithMessage("Resim URL'si en fazla 1000 karakter olabilir.");
            });
        }
    }
}
