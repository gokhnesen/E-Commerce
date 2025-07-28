using ECommerceAPI.Application.Features.Brands.Commands.Create;
using ECommerceAPI.Application.Features.Brands.Commands.Delete;
using ECommerceAPI.Application.Features.Brands.Commands.Update;
using ECommerceAPI.Application.Features.Brands.Queries.GetById;
using ECommerceAPI.Application.Features.Brands.Queries.GetList;
using ECommerceAPI.Controllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandsController : BaseController
    {
        

        [HttpGet]
        public async Task<IActionResult> GetList()
        {
            GetListBrandQuery getListBrandQuery = new();
            List<GetListBrandResponse> response = await Mediator.Send(getListBrandQuery);
            return Ok(response);
        }

        [HttpGet("{Id}")]
        public async Task<IActionResult> GetById([FromRoute] GetByIdBrandQuery getByIdBrandQuery)
        {
            GetByIdBrandResponse response = await Mediator.Send(getByIdBrandQuery);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateBrandCommand createBrandCommand)
        {
            CreateBrandResponse response = await Mediator.Send(createBrandCommand);
            return Ok(response);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateBrandCommand updateBrandCommand)
        {
            UpdateBrandResponse response = await Mediator.Send(updateBrandCommand);
            return Ok(response);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> Delete([FromRoute] DeleteBrandCommand deleteBrandCommand)
        {
            DeleteBrandResponse response = await Mediator.Send(deleteBrandCommand);
            return Ok(response);
        }
    }
} 