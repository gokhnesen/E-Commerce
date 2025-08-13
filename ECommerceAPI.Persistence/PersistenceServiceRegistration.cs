using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Interfaces.Brand;
using ECommerceAPI.Application.Interfaces.BrandCategory;
using ECommerceAPI.Application.Interfaces.Cache;
using ECommerceAPI.Application.Interfaces.Cart;
using ECommerceAPI.Application.Interfaces.DeliveryMethod;
using ECommerceAPI.Application.Interfaces.Order;
using ECommerceAPI.Application.Interfaces.Payment;
using ECommerceAPI.Domain.Entities;
using ECommerceAPI.Persistence.Contexts;
using ECommerceAPI.Persistence.Repositories;
using ECommerceAPI.Persistence.Repositories.Brand;
using ECommerceAPI.Persistence.Repositories.Cache;
using ECommerceAPI.Persistence.Repositories.Cart;
using ECommerceAPI.Persistence.Repositories.CategoryBrand;
using ECommerceAPI.Persistence.Repositories.DeliveryMethod;
using ECommerceAPI.Persistence.Repositories.Order;
using ECommerceAPI.Persistence.Repositories.Payment;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Persistence
{
    public static class PersistenceServiceRegistration
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddDbContext<ECommerceAPIDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("SqlServer")));
            services.AddScoped<IProductWriteRepository, ProductWriteRepository>();
            services.AddScoped<IProductReadRepository, ProductReadRepository>();
            services.AddScoped<ICategoryReadRepository, CategoryReadRepository>();
            services.AddScoped<ICategoryWriteRepository, CategoryWriteRepository>();
            services.AddScoped<IBrandWriteRepository, BrandWriteRepository>();
            services.AddScoped<IBrandReadRepository, BrandReadRepository>();
            services.AddScoped<ICartReadRepository, CartReadRepository>(); 
            services.AddScoped<ICartWriteRepository, CartWriteRepository>();
            services.AddScoped<UserManager<User>>();
            services.AddScoped<IPaymentInterface, PaymentRepository>();
            services.AddScoped<IOrderReadRepository, OrderReadRepository>();
            services.AddScoped<IOrderWriteRepository, OrderWriteRepository>();
            services.AddScoped<IDeliveryReadRepository, DeliveryReadRepository>();
            services.AddScoped<IDeliveryWriteRepository, DeliveryWriteRepository>();
            services.AddScoped<ICategoryBrandReadRepository, CategoryBrandReadRepository>();
            services.AddScoped<ICategoryBrandWriteRepository, CategoryBrandWriteRepository>();
            services.AddScoped<IResponseCacheService, ResponseCacheService>();

            services.AddScoped(typeof(IReadRepository<>), typeof(ReadRepository<>));




            return services;

        }
    }
}
