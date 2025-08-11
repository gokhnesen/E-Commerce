using AutoMapper;
using ECommerceAPI.Application.Features.Products.Commands.Create;
using ECommerceAPI.Application.Features.Products.Commands.Delete;
using ECommerceAPI.Application.Features.Products.Commands.Update;
using ECommerceAPI.Application.Features.Products.Queries.GetById;
using ECommerceAPI.Application.Features.Products.Queries.GetList;
using ECommerceAPI.Domain.Entities;

namespace ECommerceAPI.Application.Features.Products.Profiles
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<CreateProductCommand, Product>()
                .ForMember(dest => dest.CategoryId, opt => opt.Ignore())
                .ForMember(dest => dest.BrandId, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.Brand, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore());

           
            CreateMap<Product, CreateProductResponse>().ReverseMap();

            CreateMap<Product, DeleteProductCommand>().ReverseMap();
            CreateMap<Product, DeleteProductResponse>().ReverseMap();

            CreateMap<UpdateProductCommand, Product>()
                           .ForMember(dest => dest.CategoryId, opt => opt.Ignore())
                           .ForMember(dest => dest.BrandId, opt => opt.Ignore())
                           .ForMember(dest => dest.Category, opt => opt.Ignore())
                           .ForMember(dest => dest.Brand, opt => opt.Ignore())
                           .ForMember(dest => dest.Name, opt => opt.Condition(src => src.Name != null))
                           .ForMember(dest => dest.Description, opt => opt.Condition(src => src.Description != null))
                           .ForMember(dest => dest.Price, opt => opt.Condition(src => src.Price.HasValue))
                           .ForMember(dest => dest.Stock, opt => opt.Condition(src => src.Stock.HasValue))
                           .ForMember(dest => dest.PictureUrl, opt => opt.Condition(src => src.PictureUrl != null));
            CreateMap<Product, UpdateProductResponse>().ReverseMap();

            CreateMap<Product, GetByIdProductQuery>().ReverseMap();
            CreateMap<Product, GetByIdProductQueryResponse>().ReverseMap();

            CreateMap<Product, GetListProductQueryResponse>().ReverseMap();
        }
    }
}