using ECommerceAPI.Application.Features.Products.Commands.Create;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : BaseController
    {
        [HttpPost("add")]
        public async Task<IActionResult> CreateHotel([FromBody] CreateProductCommand createProductCommand)
        {
            CreateProductResponse response = await Mediator.Send(createProductCommand);
            return Ok(response);
        }
    }
}
