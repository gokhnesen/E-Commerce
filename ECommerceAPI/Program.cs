
using ECommerceAPI.Application;

namespace ECommerceAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddApplicationServices();
            builder.Services.AddControllers();
            builder.Services.AddSwaggerGen();
            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger(); // <== Swagger JSON endpoint
                app.UseSwaggerUI(); // <== Swagger UI arayüzü
            }
            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
