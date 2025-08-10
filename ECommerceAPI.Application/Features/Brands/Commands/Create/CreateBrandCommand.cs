using MediatR;

namespace ECommerceAPI.Application.Features.Brands.Commands.Create
{
    public class CreateBrandCommand : IRequest<CreateBrandResponse>
    {
        public string Name { get; set; }
        public string? Description { get; set; }
    }
} 