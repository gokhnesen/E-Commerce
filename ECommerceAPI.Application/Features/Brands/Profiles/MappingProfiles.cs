using AutoMapper;
using ECommerceAPI.Application.Features.Brands.Commands.Create;
using ECommerceAPI.Application.Features.Brands.Commands.Delete;
using ECommerceAPI.Application.Features.Brands.Commands.Update;
using ECommerceAPI.Application.Features.Brands.Queries.GetById;
using ECommerceAPI.Application.Features.Brands.Queries.GetList;
using ECommerceAPI.Domain.Entities;
using static ECommerceAPI.Application.Features.Categories.CategoryBrands.Queries.GetById.GetByIdCategoryBrandResponse;

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

            CreateMap<Brand, BrandDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ReverseMap();
        }
    }
} 