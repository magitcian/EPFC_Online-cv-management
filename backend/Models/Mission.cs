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

        [Required]
        [ForeignKey(nameof(Enterprise))]
        public int ClientId { get; set; } 
        [Required]
        public Enterprise Client { get; set; } 
        
        public Mission(DateTime start, DateTime finish, string title, string description) : base(start, finish, title, description) {

        }


        public Mission() {

        }
    }
}