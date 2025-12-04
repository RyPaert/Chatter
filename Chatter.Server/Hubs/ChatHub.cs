using Microsoft.AspNetCore.SignalR;

namespace Chatter.Server.Hubs
{
	public class ChatHub : Hub
	{
        public async Task SendMessage(string user, string messageText, int id)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, messageText, id);
        }
    }
}
