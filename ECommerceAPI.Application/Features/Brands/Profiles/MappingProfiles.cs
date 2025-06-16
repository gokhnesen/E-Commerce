using AutoMapper;
using ECommerceAPI.Application.Features.Brands.Commands.Create;
using ECommerceAPI.Application.Features.Brands.Queries.GetList;
using ECommerceAPI.Domain.Entities;

namespace ECommerceAPI.Application.Features.Brands.Profiles
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Brand, CreateBrandCommand>().ReverseMap();
            CreateMap<Brand, CreateBrandResponse>().ReverseMap();
            CreateMap<Brand, GetListBrandResponse>().ReverseMap();
        }
    }
} 