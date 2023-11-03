namespace OktaChallengeAPI.Web.Authorization
{
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.IdentityModel.Tokens;
    using System.Text;

    public static class MiddlewareSecurityExtensions
    {
        public static void ConfigureSecurity(this IServiceCollection services, SecurityConfig config, bool dummyIssuer = false)
        {
            var issuer = $"https://{config.Domain}/";

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Authority = dummyIssuer ? null : issuer;
                options.SaveToken = true;

                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    IssuerSigningKey = dummyIssuer ? new SymmetricSecurityKey(Encoding.UTF8.GetBytes("12345678901234567890123456789012")) : null,
                    ValidIssuer = dummyIssuer ? issuer : null,
                    ValidateIssuerSigningKey = dummyIssuer,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudiences = config.Audiences,
                    RoleClaimType = "notes-app/roles",
                    NameClaimType = "notes-app/user_email",
                };
            });

            services.AddAuthorizationCore(options =>
            {
                foreach (var authorization in config.Authorizations)
                {
                    options.AddPolicy(authorization, policy => policy.Requirements.Add(new HasScopeRequirement(authorization, issuer)));
                }
            });

            services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();
        }
    }
}