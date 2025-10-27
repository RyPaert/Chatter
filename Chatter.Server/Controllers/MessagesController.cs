using Chatter.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Chatter.Server.Controllers
{
	[ApiController]
	[Route("messages")]
	public class MessagesController : ControllerBase
	{
		private static readonly List<Message> Messages = new List<Message>();

		[HttpGet]
		public ActionResult<IEnumerable<Message>> GetMessages()
		{
			return Ok(Messages);
		}

		[HttpPost]
		public ActionResult<Message> PostMessages([FromBody] Message message)
		{
			if (message == null) return BadRequest();

			message.Id = Guid.NewGuid();
			Messages.Add(message);
			return Ok(message);
		}

		[HttpDelete("{id}")]
		public IActionResult Delete(Guid id)
		{
			var message = Messages.FirstOrDefault(m => m.Id == id);
			if (message == null) return NotFound();

			Messages.Remove(message);
			return NoContent();
		}
	}
}
