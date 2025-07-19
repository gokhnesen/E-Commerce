using ECommerceAPI.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Authentication;
using System.Security.Claims;

namespace ECommerceAPI.Application.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static async Task<User> GetUserByEmail(this UserManager<User> userManager, ClaimsPrincipal user)
        {
            var userToReturn = await userManager.Users.FirstOrDefaultAsync(u => u.Email == user.GetEmail());
            if (userToReturn == null) throw new AuthenticationException("User not found");
            return userToReturn;
        }

        public static async Task<User> GetUserByEmailWithAddress(this UserManager<User> userManager, ClaimsPrincipal user)
        {
            var userToReturn = await userManager.Users
                .Include(x => x.Address)
                .FirstOrDefaultAsync(u => u.Email == user.GetEmail());

            if (userToReturn == null)
                throw new AuthenticationException("User not found");

            return userToReturn;
        }

        public static string GetEmail(this ClaimsPrincipal user)
        {
            var email = user.FindFirstValue(ClaimTypes.Email);
            if (email == null)
                throw new AuthenticationException("Email claim not found");

            return email;
        }
    }
}