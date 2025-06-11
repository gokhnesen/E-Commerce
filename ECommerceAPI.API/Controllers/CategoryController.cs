using ECommerceAPI.Application.Features.Categories.Commands.Create;
using ECommerceAPI.Application.Features.Categories.Commands.Delete;
using ECommerceAPI.Application.Features.Categories.Commands.Update;
using ECommerceAPI.Application.Features.Categories.Queries.GetById;
using ECommerceAPI.Application.Features.Categories.Queries.GetList;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetList()
        {
            var query = new GetListCategoryQuery();
            var response = await Mediator.Send(query);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var query = new GetByIdCategoryQuery { Id = id };
            var response = await Mediator.Send(query);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryCommand createCategoryCommand)
        {
            CreateCategoryResponse response = await Mediator.Send(createCategoryCommand);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            DeleteCategoryResponse response = await Mediator.Send(new DeleteCategoryCommand { Id = id });
            return Ok(response);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateCategoryCommand updateCategoryCommand)
        {
            UpdateCategoryResponse response = await Mediator.Send(updateCategoryCommand);
            return Ok(response);
        }
    }
} 