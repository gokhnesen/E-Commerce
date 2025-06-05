using ECommerceAPI.Application.Features.Products.Commands.Create;
using ECommerceAPI.Application.Features.Products.Commands.Delete;
using ECommerceAPI.Application.Features.Products.Commands.Update;
using ECommerceAPI.Application.Features.Products.Queries.GetById;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : BaseController
    {


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute]Guid id)
        {
           var query = new GetByIdProductQuery { Id = id };
            var response = await Mediator.Send(query);
            return Ok(response);
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateHotel([FromBody] CreateProductCommand createProductCommand)
        {
            CreateProductResponse response = await Mediator.Send(createProductCommand);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct([FromRoute] Guid id)
        {
            DeleteProductResponse response = await Mediator.Send(new DeleteProductCommand { Id = id });
            return Ok(response);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateProductCommand updateProductCommand)
        {
            UpdateProductResponse response = await Mediator.Send(updateProductCommand);
            return Ok(response);
        }
    }
}
