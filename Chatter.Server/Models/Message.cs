namespace Chatter.Server.Models
{
	public class Message
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		public string User {  get; set; }
		public string MessageText { get; set; }
	}
}
