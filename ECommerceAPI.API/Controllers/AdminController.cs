using ECommerceAPI.Application.Features.Admin.Queries.GetList;
using ECommerceAPI.Application.Features.Admin.Queries.GetOrders;
using ECommerceAPI.Application.Features.Orders.OrderSpecs;
using ECommerceAPI.Application.Features.Orders.Queries.GetById;
using ECommerceAPI.Application.Features.Orders.Queries.GetList;
using ECommerceAPI.Application.Features.Products.Queries.GetList;
using ECommerceAPI.Application.Interfaces.Order;
using ECommerceAPI.Application.Interfaces.Payment;
using ECommerceAPI.Application.Specification;
using ECommerceAPI.Controllers;
using ECommerceAPI.Domain.Entities;
using ECommerceAPI.Domain.Entities.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.API.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController(IOrderReadRepository orderReadRepository, IPaymentInterface paymentService, IOrderWriteRepository orderWriteRepository, UserManager<User> userManager) : BaseController
    {
        [HttpGet("orders")]
        public async Task<ActionResult<Pagination<Order>>> GetOrders([FromQuery] OrderSpecParams specParams)
        {
            var query = new GetListAdminOrderQuery(specParams);
            var response = await Mediator.Send(query);
            return Ok(response);
        }

        [HttpGet("orders/{id}")]
        public async Task<ActionResult<Order>> GetOrderById([FromRoute]Guid id)
        {
            var query = new GetByIdAdminOrderQuery { Id = id};
            var response = await Mediator.Send(query);
            return Ok(response);
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
                await orderWriteRepository.SaveAsync();

                return Ok(order);
            }

            return BadRequest("Ödeme iadesi başarısız oldu");
        }

        [HttpPost("unlock-user/{email}")]
        public async Task<ActionResult> UnlockUser([FromRoute] string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null) return NotFound("Kullanıcı bulunamadı");

            var result = await userManager.SetLockoutEndDateAsync(user, null);
            
            if (result.Succeeded)
            {
                await userManager.ResetAccessFailedCountAsync(user);
                return Ok("Kullanıcı kilidi kaldırıldı");
            }

            return BadRequest("Kullanıcı kilidi kaldırılamadı");
        }

        [HttpGet("user-lockout-status/{email}")]
        public async Task<ActionResult> GetUserLockoutStatus([FromRoute] string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null) return NotFound("Kullanıcı bulunamadı");

            var isLockedOut = await userManager.IsLockedOutAsync(user);
            var lockoutEnd = await userManager.GetLockoutEndDateAsync(user);
            var failedAttempts = await userManager.GetAccessFailedCountAsync(user);

            return Ok(new
            {
                IsLockedOut = isLockedOut,
                LockoutEnd = lockoutEnd,
                FailedAttempts = failedAttempts,
                Email = email
            });
        }
    }
}
