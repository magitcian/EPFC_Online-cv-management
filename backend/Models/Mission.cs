using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid2122_g03.Models
{

    public class Mission : Experience//: IValidatableObject
    {
        public virtual Enterprise Client { get; set; }
        public Mission(DateTime start, DateTime finish, string title, string description) : base(start, finish, title, description) {

        }


        public Mission() {

        }
    }
}