using AutoMapper;
using ECommerceAPI.Application.Features.Categories.CategoryBrands.Queries.GetById;
using ECommerceAPI.Application.Features.Categories.Commands.Create;
using ECommerceAPI.Application.Features.Categories.Commands.Delete;
using ECommerceAPI.Application.Features.Categories.Commands.Update;
using ECommerceAPI.Application.Features.Categories.Queries.GetById;
using ECommerceAPI.Application.Features.Categories.Queries.GetByName;
using ECommerceAPI.Application.Features.Categories.Queries.GetList;
using ECommerceAPI.Domain.Entities;
using System.Linq;

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
            CreateMap<Category, GetByIdCategoryResponse>()
                .ForMember(dest => dest.ParentCategoryName, opt => opt.MapFrom(src => src.ParentCategory != null ? src.ParentCategory.Name : null))
                .ForMember(dest => dest.SubCategories, opt => opt.MapFrom(src => src.SubCategories));

            CreateMap<Category, ChildCategoryDto>();

            CreateMap<Category, GetListCategoryResponse>().ReverseMap();

            CreateMap<Category, GetByIdCategoryBrandResponse>()
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Brands, opt => opt.Ignore()); 

            CreateMap<Category, GetByNameCategoryQuery>().ReverseMap();
            CreateMap<Category, GetByNameCategoryResponse>()
                .ForMember(dest => dest.ParentCategoryName, opt => opt.MapFrom(src => src.ParentCategory != null ? src.ParentCategory.Name : null))
                .ForMember(dest => dest.SubCategories, opt => opt.Ignore()); // We map this manually
            CreateMap<Category, ChildCategoryDto>();
        }
    }
}