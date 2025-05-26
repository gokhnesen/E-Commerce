using AutoMapper;
using ECommerceAPI.Application.Features.Products.Commands.Create;
using ECommerceAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Products.Profiles
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product, CreateProductCommand>().ReverseMap();
            CreateMap<Product, CreateProductResponse>().ReverseMap();

        }
    }
}
