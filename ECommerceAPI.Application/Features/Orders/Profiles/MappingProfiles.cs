using AutoMapper;
using ECommerceAPI.Application.Dto;
using ECommerceAPI.Application.Features.Orders.Queries;
using ECommerceAPI.Application.Features.Products.Queries.GetById;
using ECommerceAPI.Domain.Entities;
using ECommerceAPI.Domain.Entities.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Orders.Profiles
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Order, GetByIdOrderQuery>().ReverseMap();
            CreateMap<Order, GetByIdOrderQueryResponse>().ReverseMap();

            CreateMap<Order, OrderDto>().ReverseMap();
        }
    }
}
