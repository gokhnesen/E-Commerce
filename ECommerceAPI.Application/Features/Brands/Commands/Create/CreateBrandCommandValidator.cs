using ECommerceAPI.Application.Interfaces.Brand;
using FluentValidation;

namespace ECommerceAPI.Application.Features.Brands.Commands.Create
{
    public class CreateBrandValidator : AbstractValidator<CreateBrandCommand>
    {
        private readonly IBrandReadRepository _brandReadRepository;

        public CreateBrandValidator(IBrandReadRepository brandReadRepository)
        {
            _brandReadRepository = brandReadRepository;

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Marka adı boş olamaz.")
                .MaximumLength(100).WithMessage("Marka adı en fazla 100 karakter olabilir.")
                .MustAsync(async (name, cancellation) => 
                {
                    var existingBrand = await _brandReadRepository.GetSingleAsync(b => b.Name == name);
                    return existingBrand == null;
                }).WithMessage(x => $"'{x.Name}' isimli marka zaten mevcut.");

            //RuleFor(x => x.Description)
            //    .MaximumLength(500).WithMessage("Açıklama en fazla 500 karakter olabilir.");
        }
    }
}