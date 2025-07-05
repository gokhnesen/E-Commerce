using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using System;

namespace ECommerceAPI.Infrastructure
{
    public static class InfrastructureServiceRegistration
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IConnectionMultiplexer>(config =>
            {
                var redisConnectionString = configuration.GetConnectionString("Redis");
                if (redisConnectionString == null) throw new Exception("Cannot get redis connection string");
                var redisConfiguration = ConfigurationOptions.Parse(redisConnectionString, true);
                return ConnectionMultiplexer.Connect(redisConfiguration);
            });

            return services;
        }

    }
}
