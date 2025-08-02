using ECommerceAPI.Application.Features.Orders.OrderSpecs;
using ECommerceAPI.Application.Interfaces.Order;
using ECommerceAPI.Application.Interfaces.Payment;
using ECommerceAPI.Application.Specification;
using ECommerceAPI.Controllers;
using ECommerceAPI.Domain.Entities.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.API.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController(IOrderReadRepository orderReadRepository, IPaymentInterface paymentService, IOrderWriteRepository orderWriteRepository) : BaseController
    {
        [HttpGet("orders")]
        public async Task<ActionResult<Pagination<Order>>> GetOrders([FromQuery] OrderSpecParams specParams)
        {
            var spec = new OrderSpecification(specParams);
            return await CreatePagedResult<Order>(
                orderReadRepository,
                null,
                spec,
                specParams.PageIndex,
                specParams.PageSize
            );
        }

        [HttpGet("orders/{id}")]
        public async Task<ActionResult<Order>> GetOrderById([FromRoute] Guid id)
        {
            var spec = new OrderSpecification(id);
            var order = await orderReadRepository.GetEntityWithSpec(spec);
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpPost("orders/refund/{id:guid}")]
        public async Task<ActionResult> RefundOrder([FromRoute] Guid id)
        {
            var spec = new OrderSpecification(id);
            var order = await orderReadRepository.GetEntityWithSpec(spec);
            if (order == null) return NotFound();
            if (order.Status != OrderStatus.Pending)
            {
                return BadRequest("Ödeme alınamadı");
            }
            var result = await paymentService.RefundPayment(order.PaymentIntentId);
            if (result == "succeeded")
            {
                order.Status = OrderStatus.Refunded;

                await orderWriteRepository.UpdateAsync(order);

                return Ok(order);
            }

            return BadRequest("Ödeme iadesi başarısız oldu");
        }
    }
}
