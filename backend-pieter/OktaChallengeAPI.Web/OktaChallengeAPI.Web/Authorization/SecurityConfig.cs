namespace OktaChallengeAPI.Web.Authorization
{
    using System;
    using System.Collections.Generic;
    using Microsoft.AspNetCore.Authentication.JwtBearer;

    public class SecurityConfig
    {
        public string Domain { get; set; }

        public IEnumerable<string> Authorizations { get; set; }

        public IEnumerable<string> Audiences { get; set; }

        public static string ConfigSection { get; set; } = "Auth0";
    }
}
