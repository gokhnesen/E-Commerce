using MediatR;

namespace ECommerceAPI.Application.Features.Brands.Commands.Delete
{
    public class DeleteBrandCommand : IRequest<DeleteBrandResponse>
    {
        public string Id { get; set; }
    }
} 