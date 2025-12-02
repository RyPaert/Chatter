using Chatter.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace Chatter.Server.Controllers
{
    [ApiController]
    [Route("accounts")]
    public class AccountsController : ControllerBase
    {
        //[HttpPost("{username}")]
        //public IActionResult setUsername(User user, string username)
        //{
        //    if (username == null || string.IsNullOrWhiteSpace(username)) { return BadRequest(); }
        //    else if (ModelState.IsValid)
        //    {
        //        user.Id = new Guid();
        //        user.Name = username;
        //    }
        //    return Ok(username);
        //}
    }
}
