using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OktaChallengeAPI.Web.Authorization;
using OktaChallengeAPI.Web.Constants;
using OktaChallengeAPI.Web.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var config = builder.Configuration.GetSection(SecurityConfig.ConfigSection).Get<SecurityConfig>();
config.Authorizations = Permissions.All;

builder.Services.ConfigureServicesSecurity(config);
builder.Services.AddDbContext<NotesDbContext>(options => options
    .UseSqlServer(
        builder.Configuration.GetConnectionString("Database"),
        b => b.MigrationsAssembly(typeof(NotesDbContext).Assembly.FullName)));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.Run();
