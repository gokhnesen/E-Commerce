using ECommerceAPI.Application.Features.Admin.Queries.GetById;
using MediatR;

namespace ECommerceAPI.Application.Features.Admin.Queries.GetOrders
{
    public class GetByIdAdminOrderQuery : IRequest<GetByIdAdminOrderQueryResponse>
    {
        public Guid Id { get; set; }

        //public AdminSpecParams? SpecParams { get; set; }
        //public GetByIdAdminOrderQuery(Guid id,AdminSpecParams specParams)
        //{
        //    SpecParams = specParams ?? new AdminSpecParams();
        //}
    }
}