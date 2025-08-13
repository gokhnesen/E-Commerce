using AutoMapper;
using ECommerceAPI.Application.Features.Categories.CategoryBrands.Queries.GetById;
using ECommerceAPI.Application.Features.Categories.Commands.Create;
using ECommerceAPI.Application.Features.Categories.Commands.Delete;
using ECommerceAPI.Application.Features.Categories.Commands.Update;
using ECommerceAPI.Application.Features.Categories.Queries.GetById;
using ECommerceAPI.Application.Features.Categories.Queries.GetList;
using ECommerceAPI.Domain.Entities;

namespace ECommerceAPI.Application.Features.Categories.Profiles
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Category, CreateCategoryCommand>().ReverseMap();
            CreateMap<Category, CreateCategoryResponse>().ReverseMap();

            CreateMap<Category, DeleteCategoryCommand>().ReverseMap();
            CreateMap<Category, DeleteCategoryResponse>().ReverseMap();

            CreateMap<Category, UpdateCategoryCommand>().ReverseMap();
            CreateMap<Category, UpdateCategoryResponse>().ReverseMap();

            CreateMap<Category, GetByIdCategoryQuery>().ReverseMap();
            CreateMap<Category, GetByIdCategoryResponse>().ReverseMap();

            CreateMap<Category, GetListCategoryResponse>().ReverseMap();


            // Map Category to GetByIdCategoryBrandResponse
            CreateMap<Category, GetByIdCategoryBrandResponse>()
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Brands, opt => opt.Ignore()); // Brands are populated separately
        }
    }
} 