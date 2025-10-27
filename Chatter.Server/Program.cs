using Chatter.Server.Hubs;
namespace Chatter.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddSignalR();
			builder.Services.AddCors(options =>
			{
				options.AddPolicy("ShittyFuckingCorsPolicyBullshit", policy =>
				{
					policy.WithOrigins("http://localhost:5173")
						  .AllowAnyHeader()
						  .AllowAnyMethod()
						  .AllowCredentials();
				});
			});

			var app = builder.Build();

            app.UseCors("ShittyFuckingCorsPolicyBullshit");

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();
            app.MapHub<ChatHub>("/chathub");

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
