using ECommerceAPI.Application.Features.Orders.OrderSpecs;
using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Interfaces.Order;
using ECommerceAPI.Application.Interfaces.Payment;
using ECommerceAPI.Application.SignalR;
using ECommerceAPI.Controllers;
using ECommerceAPI.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Stripe;

namespace ECommerceAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController(IPaymentInterface paymentService, IReadRepository<DeliveryMethod> dmRepo, ILogger<PaymentController> logger,
        IConfiguration config, IOrderReadRepository _orderReadRepository, IOrderWriteRepository _orderWriteRepository, IHubContext<NotificationHub> hubContext) 
        : BaseController
    {

        private readonly string _whSecret = config["StripeSettings:WhSecret"];


        [Authorize]
        [HttpPost("{cartId}")]
        public async Task<ActionResult<Cart>> CreateOrUpdatePaymentIntent(string cartId)
        {
            var cart = await paymentService.CreateOrUpdatePaymentIntent(cartId);
            if (cart == null)
            {
                return BadRequest("Ödeme islemi basarisiz.");

            }
            return Ok(cart);
        }

        [HttpGet("delivery-methods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            return Ok(await dmRepo.GetAllAsync());
        }

        // Webhook'un Stripe tarafından erişilebilir olması için AllowAnonymous ekleyin
        [AllowAnonymous]
        [HttpPost("webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                var stripeEvent = ConstructStripeEvent(json);

                switch (stripeEvent.Type)
                {
                    case "payment_intent.succeeded":
                        if (stripeEvent.Data.Object is PaymentIntent intent)
                        {
                            await HandlePaymentIntentSucceeded(intent);
                        }
                        else
                        {
                            logger.LogWarning("PaymentIntent object not found in succeeded event");
                            return BadRequest("Ödeme intenti bulunamadi.");
                        }
                        break;
                    case "payment_intent.payment_failed":
                        if (stripeEvent.Data.Object is PaymentIntent failedIntent)
                        {
                            await HandlePaymentIntentFailed(failedIntent);
                        }
                        else
                        {
                            logger.LogWarning("PaymentIntent object not found in failed event");
                        }
                        break;
                    default:
                        logger.LogInformation("Unhandled event type: {EventType}", stripeEvent.Type);
                        break;
                }

                return Ok();
            }
            catch (StripeException ex)
            {
                logger.LogError(ex, "Stripe webhook error");
                return StatusCode(StatusCodes.Status400BadRequest, "Webhook signature verification failed");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Beklenmeyen hata");
                return StatusCode(StatusCodes.Status500InternalServerError, "Beklenmeyen hata");
            }
        }

        private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
        {
            try
            {
                if (intent.Status == "succeeded")
                {
                    var spec = new OrderSpecification(intent.Id, true);
                    var order = await _orderReadRepository.GetEntityWithSpec(spec);

                    if (order == null)
                    {
                        logger.LogWarning("Order not found for PaymentIntent: {PaymentIntentId}", intent.Id);
                        return;
                    }


                    if (order.Status == Domain.Entities.Order.OrderStatus.Basarili)
                    {
                        logger.LogInformation("Order {OrderId} already marked as Basarili, skipping.", order.Id);
                        return;
                    }

                    if ((long)order.GetTotal() * 100 != intent.Amount)
                    {
                        order.Status = Domain.Entities.Order.OrderStatus.Odenmedi;
                        logger.LogWarning("Payment amount mismatch for Order: {OrderId}. Expected: {Expected}, Received: {Received}",
                            order.Id, (long)order.GetTotal() * 100, intent.Amount); 
                    }
                    else
                    {
                        order.Status = Domain.Entities.Order.OrderStatus.Basarili;
                        logger.LogInformation("Payment succeeded for Order: {OrderId}", order.Id);
                    }

                    await _orderWriteRepository.UpdateAsync(order);
                    await _orderWriteRepository.SaveAsync();

                    var connectionId = NotificationHub.GetConnectionByIdEmail(order.BuyerEmail);

                    if(!string.IsNullOrEmpty(connectionId))
                    {
                        await hubContext.Clients.Client(connectionId).SendAsync("OrderCompleteNotification",order);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error handling payment intent succeeded for PaymentIntent: {PaymentIntentId}", intent.Id);
                throw;
            }
        }

        private async Task HandlePaymentIntentFailed(PaymentIntent intent)
        {
            try
            {
                var spec = new OrderSpecification(intent.Id, true);
                var order = await _orderReadRepository.GetEntityWithSpec(spec);

                if (order == null)
                {
                    logger.LogWarning("Order not found for failed PaymentIntent: {PaymentIntentId}", intent.Id);
                    return;
                }

                // İdempotency: zaten başarısız olarak işaretlendiyse tekrar işleme
                if (order.Status == Domain.Entities.Order.OrderStatus.Basarisiz)
                {
                    logger.LogInformation("Order {OrderId} already marked as Basarisiz, skipping.", order.Id);
                    return;
                }

                order.Status = Domain.Entities.Order.OrderStatus.Basarisiz;
                await _orderWriteRepository.UpdateAsync(order);
                await _orderWriteRepository.SaveAsync();

                logger.LogInformation("Payment failed for Order: {OrderId}", order.Id);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error handling payment intent failed for PaymentIntent: {PaymentIntentId}", intent.Id);
                throw;
            }
        }

        private Event ConstructStripeEvent(string json)
        {
            try
            {
                return EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _whSecret);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Stripe event construction failed");
                throw new StripeException("Invalid signature");
            }
        }
    }
}
