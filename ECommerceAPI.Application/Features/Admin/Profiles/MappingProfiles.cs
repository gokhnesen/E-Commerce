using AutoMapper;
using ECommerceAPI.Application.Features.Admin.Queries.GetById;
using ECommerceAPI.Application.Features.Admin.Queries.GetList;
using ECommerceAPI.Application.Features.Orders.Queries.GetById;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Admin.Profiles
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Domain.Entities.Order.Order, GetByIdAdminOrderQueryResponse>().ReverseMap();
            CreateMap<Domain.Entities.Order.Order, GetByIdOrderQuery>().ReverseMap();

            CreateMap<Domain.Entities.Order.Order, GetListAdminOrderQueryResponse>().ReverseMap();

        }
    }
}
