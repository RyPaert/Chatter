using Chatter.Server.Hubs;
using Chatter.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Chatter.Server.Controllers
{
	[ApiController]
	[Route("messages")]
	public class MessagesController : ControllerBase
	{
        private static readonly List<Message> Messages = new List<Message>();
        private readonly IHubContext<ChatHub> _hubContext;

        public MessagesController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

       
        [HttpGet]
        public ActionResult<IEnumerable<Message>> GetMessages()
        {
            return Ok(Messages);
        }

       
        [HttpPost]
        public async Task<ActionResult<Message>> PostMessage([FromBody] Message message)
        {
            if (message == null || string.IsNullOrWhiteSpace(message.MessageText))
                return BadRequest("Invalid message.");

            message.Id = Guid.NewGuid();
            Messages.Add(message);

           
            await _hubContext.Clients.All.SendAsync(
                "ReceiveMessage",
                message.User,
                message.MessageText,
                message.Id
            );

            return Ok(message);
        }

    
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(Guid id, [FromQuery] string user)
        {
            var message = Messages.FirstOrDefault(m => m.Id == id);

            if (message == null)
                return NotFound();

            
            if (!string.Equals(message.User, user, StringComparison.OrdinalIgnoreCase))
                return Forbid("You can only delete your own messages.");

            Messages.Remove(message);

            await _hubContext.Clients.All.SendAsync("MessageDeleted", id);

            return NoContent();
        }
    }
}
