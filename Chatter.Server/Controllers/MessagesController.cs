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
		public MessagesController(IHubContext<ChatHub> hubContext) { _hubContext = hubContext; }

		[HttpGet]
		public ActionResult<IEnumerable<Message>> GetMessages()
		{
			return Ok(Messages);
		}

		[HttpPost]
		public async Task<ActionResult<Message>> PostMessages([FromBody] Message message)
		{
			if (message == null) return BadRequest();

			message.Id = Guid.NewGuid();
			Messages.Add(message);

			await _hubContext.Clients.All.SendAsync
				(
				"ReceiveMessage",
				message.User,
				message.MessageText,
				message.Id
				);

			return Ok(message);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteMessage(Guid id)
		{
			var message = Messages.FirstOrDefault(m => m.Id == id);
			if (message == null) return NotFound();

			await _hubContext.Clients.All.SendAsync
				(
				"MessageDeleted",
				id
				);

			Messages.Remove(message);
			return NoContent();
		}
	}
}
