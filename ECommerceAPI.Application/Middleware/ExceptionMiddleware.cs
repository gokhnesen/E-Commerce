using ECommerceAPI.Application.Errors;
using ECommerceAPI.Application.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Middleware
{
    public class ExceptionMiddleware(IHostEnvironment env, RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex, env);   
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception ex, IHostEnvironment env)
        {
            context.Response.ContentType = "application/json";
            
            context.Response.StatusCode = ex switch
            {
                ValidationException => (int)HttpStatusCode.BadRequest,
                ArgumentException => (int)HttpStatusCode.BadRequest,
                KeyNotFoundException => (int)HttpStatusCode.NotFound,
                UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
                _ => (int)HttpStatusCode.InternalServerError
            };

            object response;
            
            if (ex is ValidationException validationEx)
            {
                response = new 
                {
                    StatusCode = context.Response.StatusCode,
                    Message = "Validation failed",
                    Errors = validationEx.Errors
                };
            }
            else
            {
                
                response = env.IsDevelopment() 
                    ? new ApiErrorResponse(context.Response.StatusCode, ex.Message, ex.StackTrace)
                    : new ApiErrorResponse(context.Response.StatusCode, ex.Message, "Internal server error");
            }

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            var json = JsonSerializer.Serialize(response, options);

            return context.Response.WriteAsync(json);
        }
    }
}
