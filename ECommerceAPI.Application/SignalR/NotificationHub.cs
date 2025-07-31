using ECommerceAPI.Application.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.SignalR
{
    [Authorize]
    public class NotificationHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string> UserConnections = new();

        public override Task OnConnectedAsync()
        {
            var email = Context.User?.GetEmail();
            if(!string.IsNullOrEmpty(email)) UserConnections[email] = Context.ConnectionId;

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var email = Context.User?.GetEmail();
            if (!string.IsNullOrEmpty(email)) UserConnections.TryRemove(email, out _);

            return base.OnDisconnectedAsync(exception);
        }

        public static string? GetConnectionByIdEmail(string email)
        {
            UserConnections.TryGetValue(email, out var connectionId);

            return connectionId;
        }
    }
}
