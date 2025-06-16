using MediatR;

namespace ECommerceAPI.Application.Features.Brands.Commands.Update
{
    public class UpdateBrandCommand : IRequest<UpdateBrandResponse>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
} 