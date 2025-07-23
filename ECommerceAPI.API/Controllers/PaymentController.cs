using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Interfaces.Payment;
using ECommerceAPI.Controllers;
using ECommerceAPI.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController(IPaymentInterface paymentService, IReadRepository<DeliveryMethod> dmRepo) : BaseController
    {
        [Authorize]
        [HttpPost("{cartId}")]
        public async Task<ActionResult<Cart>> CreateOrUpdatePaymentIntent(string cartId)
        {
            var cart = await paymentService.CreateOrUpdatePaymentIntent(cartId);
            if (cart == null)
            {
                return BadRequest("Ödeme işlemi başarısız.");

               
            }
            return Ok(cart);
        }

        [HttpGet("delivery-methods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            return Ok(await dmRepo.GetAllAsync());
        }

    }
}
