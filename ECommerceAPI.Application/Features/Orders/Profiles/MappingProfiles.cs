using AutoMapper;
using ECommerceAPI.Application.Features.Orders.Commands.Create;
using ECommerceAPI.Application.Features.Orders.Queries.GetById;
using ECommerceAPI.Application.Features.Orders.Queries.GetList;
using ECommerceAPI.Domain.Entities;
using ECommerceAPI.Domain.Entities.Order;

namespace ECommerceAPI.Application.Features.Orders.Profiles
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Order, GetByIdOrderQuery>().ReverseMap();
            CreateMap<Order, GetByIdOrderQueryResponse>().ReverseMap();
            CreateMap<Order, GetListOrderQueryResponse>().ReverseMap();

            CreateMap<CreateOrderCommand, Order>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(dest => dest.OrderDate, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => OrderStatus.Pending))
                .ForMember(dest => dest.DeliveryMethod, opt => opt.Ignore())
                .ForMember(dest => dest.OrderItems, opt => opt.Ignore())     
                .ForMember(dest => dest.ShippingAddress, opt => opt.MapFrom(src => src.ShippingAddress))
                .ForMember(dest => dest.PaymentSummary, opt => opt.MapFrom(src => src.PaymentSummary));

            CreateMap<Order, CreateOrderResponse>().ReverseMap();
        }
    }
}
