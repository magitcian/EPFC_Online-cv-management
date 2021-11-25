using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using prid2122_g03.Models;

namespace prid2122_g03.Helpers
{
    public class AuthorizedAttribute : AuthorizeAttribute
    {
        // public AuthorizedAttribute(params Role[] roles) : base() {
        //     var rolesNames = new List<string>();
        //     var names = Enum.GetNames(typeof(Role));
        //     foreach (var role in roles) {
        //         rolesNames.Add(names[(int)role]);
        //     }
        //     Roles = String.Join(",", rolesNames);
        // }

        public AuthorizedAttribute(params Title[] titles) : base() {
            var titlesNames = new List<string>();
            var names = Enum.GetNames(typeof(Title));
            foreach (var title in titles) {
                titlesNames.Add(names[(int)title]);
            }
            Roles = String.Join(",", titlesNames); // TODO ask where Roles comes from ?
        }
    }
}
