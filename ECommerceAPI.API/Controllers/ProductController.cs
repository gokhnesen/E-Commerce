using ECommerceAPI.Application.Features.Products.Commands.Create;
using ECommerceAPI.Application.Features.Products.Commands.Delete;
using ECommerceAPI.Application.Features.Products.Commands.Update;
using ECommerceAPI.Application.Features.Products.ProductSpecs;
using ECommerceAPI.Application.Features.Products.Queries.GetById;
using ECommerceAPI.Application.Features.Products.Queries.GetList;
using ECommerceAPI.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.API.Controllers
{
    public class ProductController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetList([FromQuery]ProductSpecParams specParams)
        {

            var query = new GetListProductQuery(specParams);
            var response = await Mediator.Send(query);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute]Guid id)
        {
            var query = new GetByIdProductQuery { Id = id };
            var response = await Mediator.Send(query);
            return Ok(response);
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductCommand createProductCommand)
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
        public async Task<IActionResult> UpdateProduct([FromBody] UpdateProductCommand updateProductCommand)
        {
            UpdateProductResponse response = await Mediator.Send(updateProductCommand);
            return Ok(response);
        }
    }
}
