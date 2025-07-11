using ECommerceAPI.Application.Interfaces.Cart;
using ECommerceAPI.Controllers;
using ECommerceAPI.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController(ICartReadRepository cartReadService, ICartWriteRepository cartWriteService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<Cart>> GetCartById(string id)
        {
            var cart = await cartReadService.GetCartAsync(id);
            return Ok(cart ?? new Cart { Id = id });
        }
        [HttpPost]
        public async Task<ActionResult<Cart>> UpdateCart(Cart cart)
        {
            var updatedCart = await cartWriteService.SetCartAsync(cart);
            if(updatedCart == null)
            {
                return BadRequest("Failed to update the cart.");
            }
            return Ok(updatedCart);
        }
        [HttpDelete("remove-cart/{id}")]
        public async Task<ActionResult> DeleteCart(string id)
        {
            var result = await cartWriteService.DeleteCartAsync(id);
            if (!result) return BadRequest("Error deleting cart");
            return Ok();
        }
    }
}
