using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid2122_g03.Models
{

        public enum Grade
    {
        Senior = 0, Expert = 1, Junior = 2
    }

    public class Training : Experience //: IValidatableObject
    {
        public Grade Grade { get; set; }
        public Training(DateTime start, DateTime finish, string title, string description, Grade grade) : base(start, finish, title, description) {
            Grade = grade;
        }

        public Training() {

        }

    }
}