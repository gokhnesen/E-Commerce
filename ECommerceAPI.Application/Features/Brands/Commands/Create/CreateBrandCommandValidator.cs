using FluentValidation;

namespace ECommerceAPI.Application.Features.Brands.Commands.Create
{
    public class CreateBrandValidator : AbstractValidator<CreateBrandCommand>
    {
        public CreateBrandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Marka adı boş olamaz.")
                .MaximumLength(100).WithMessage("Marka adı en fazla 100 karakter olabilir.");

            //RuleFor(x => x.Description)
            //    .MaximumLength(500).WithMessage("Açıklama en fazla 500 karakter olabilir.");
        }
    }
}