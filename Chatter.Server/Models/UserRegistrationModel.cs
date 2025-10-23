using System.ComponentModel.DataAnnotations;

namespace Chatter.Server.Models
{
    public class UserRegistrationModel
    {
        [Required(ErrorMessage = "Username is invalid or taken.")]
        public string UserName {  get; set; }

        [Required(ErrorMessage = "Email is invalid or taken.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is invalid.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Passwords do not match.")]
        public string ConfirmPasswword { get; set; }
    }
}
