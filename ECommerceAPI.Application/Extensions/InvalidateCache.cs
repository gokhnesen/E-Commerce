using ECommerceAPI.Application.Interfaces.Cache;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Extensions
{
    [AttributeUsage(AttributeTargets.Method)]
    public class InvalidateCache(string pattern) : Attribute, IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            if(resultContext.Exception == null || resultContext.ExceptionHandled)
            {
                var cacheService = context.HttpContext.RequestServices.GetRequiredService<IResponseCacheService>();

                await cacheService.RemoveCacheByPattern(pattern);
            }
        }
    }
}
