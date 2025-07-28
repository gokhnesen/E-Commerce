using ECommerceAPI.Application.Features.Orders.Commands.Create;
using ECommerceAPI.Application.Features.Orders.Queries;
using ECommerceAPI.Application.Features.Products.Queries.GetById;
using ECommerceAPI.Controllers;
using ECommerceAPI.Domain.Entities.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class OrderController : BaseController
    {
        [HttpPost]
        public async Task<ActionResult> CreateOrder(CreateOrderCommand request)
        {
            CreateOrderResponse response = await Mediator.Send(request);
            return Ok(response);
        }


        [HttpGet("{id:guid}")]
        public async Task<ActionResult> GetOrder(Guid id)
        {
            var query = new GetByIdOrderQuery { Id = id };
            GetByIdOrderQueryResponse response = await Mediator.Send(query);
            return Ok(response);
        }

    }
}
