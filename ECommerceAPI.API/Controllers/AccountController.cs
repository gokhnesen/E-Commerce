using ECommerceAPI.Application.Extensions;
using ECommerceAPI.Application.Features.Users.Commands.Register;
using ECommerceAPI.Application.Features.Users.Commands.UpdateAddress;
using ECommerceAPI.Controllers;
using ECommerceAPI.Domain.Entities;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace ECommerceAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController(SignInManager<User> signInManager) : BaseController
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserCommand command)
        {
            var response = await Mediator.Send(command);
            if (!response.IsSuccess)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return NoContent();
        }

        [Authorize]
        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo()
        {
            if (User.Identity?.IsAuthenticated == false) return NoContent();
            var user = await signInManager.UserManager.GetUserByEmailWithAddress(User);

            return Ok(new
            {
                user.Name,
                user.LastName,
                user.Email,
                user.Address,
                Roles = User.FindFirstValue(ClaimTypes.Role)
         
            });
        }

        [HttpGet("auth-status")]
        public ActionResult GetAuthState()
        {
            return Ok(new 
            {
                IsAuthenticated = User.Identity?.IsAuthenticated ?? false
          
            });
        }
        [Authorize]
        [HttpPost("address")]
        public async Task<ActionResult> CreateOrUpdateAddress(UpdateAddressCommand updateAddressCommand)
        {
            var response = await Mediator.Send(updateAddressCommand);

            return Ok(response);
        }

    }
}
