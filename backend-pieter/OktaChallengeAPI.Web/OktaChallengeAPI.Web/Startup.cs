namespace OktaChallengeAPI.Web
{
    using System.Reflection;
    using System.Text.Json.Serialization;
    using Microsoft.EntityFrameworkCore;
    using OktaChallengeAPI.Web.Authorization;
    using OktaChallengeAPI.Web.Constants;
    using OktaChallengeAPI.Web.Data;

    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;

        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services">The collection of services.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationInsightsTelemetry();
            services.AddLogging(c => c.AddAzureWebAppDiagnostics());
            services.AddHealthChecks();

            services
                .AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
                });

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            var config = _configuration.GetSection(SecurityConfig.ConfigSection).Get<SecurityConfig>();
            config.Authorizations = Permissions.All;

            services.ConfigureSecurity(config);
            services.AddDbContext<NotesDbContext>(options => options
                .UseSqlServer(
                    _configuration.GetConnectionString("Database"),
                    b => b.MigrationsAssembly(typeof(NotesDbContext).Assembly.FullName)));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseSwagger();

            app.UseSwaggerUI();

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHealthChecks("/");
                endpoints.MapControllers();
            });
        }
    }
}
