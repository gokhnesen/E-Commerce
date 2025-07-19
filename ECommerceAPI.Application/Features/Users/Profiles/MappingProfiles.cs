using AutoMapper;
using ECommerceAPI.Application.Features.Users.Commands.Register;
using ECommerceAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.Users.Profiles
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<User, RegisterUserCommand>().ReverseMap();
            CreateMap<User, RegisterUserResponse>().ReverseMap();

        }
    }
}
