using AutoMapper;
using ECommerceAPI.Application.Features.Brands.Commands.Create;
using ECommerceAPI.Application.Features.Brands.Commands.Delete;
using ECommerceAPI.Application.Features.Brands.Commands.Update;
using ECommerceAPI.Application.Features.Brands.Queries.GetById;
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
            CreateMap<Brand, GetByIdBrandQuery>().ReverseMap();
            CreateMap<Brand, GetByIdBrandResponse>().ReverseMap();
            CreateMap<Brand, UpdateBrandCommand>().ReverseMap();
            CreateMap<Brand, UpdateBrandResponse>().ReverseMap();
            CreateMap<Brand, DeleteBrandCommand>().ReverseMap();
            CreateMap<Brand, DeleteBrandResponse>().ReverseMap();
        }
    }
} 