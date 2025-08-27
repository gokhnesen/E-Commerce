using ECommerceAPI.Application.Interfaces.Brand;
using FluentValidation;

namespace ECommerceAPI.Application.Features.Brands.Commands.Create
{
    public class CreateBrandValidator : AbstractValidator<CreateBrandCommand>
    {

        public CreateBrandValidator(IBrandReadRepository brandReadRepository)
        {

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Marka adı boş olamaz.")
                .MaximumLength(100).WithMessage("Marka adı en fazla 100 karakter olabilir.");

        }
    }
}