using ECommerceAPI.Application.Features.Commands.Brand.CreateBrand;
using ECommerceAPI.Application.Features.Queries.Brand.GetAllBrands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BrandsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var query = new GetAllBrandsQuery();
            var brands = await _mediator.Send(query);
            return Ok(brands);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateBrandCommand createBrandCommand)
        {
            var response = await _mediator.Send(createBrandCommand);
            return Ok(response);
        }
    }
} 