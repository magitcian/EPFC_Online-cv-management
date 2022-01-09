using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema; // propr [NotMapped]


namespace prid2122_g03.Models
{
    public class Consultant : User //: IValidatableObject
    {
        public int? ManagerId { get; set; }
        public Manager Manager { get; set; } // public virtual Manager Manager { get; set; }    // check if virtual is needed as inheritance

        public Consultant() { 
        } 

        public Consultant(string lastName, string firstName, string email, string password, Manager manager, DateTime birthdate) : base(lastName, firstName, email, password, birthdate) {
            Manager = manager;
        } 

        // add method to add a manager => maybe better to add this in Manager class

    }

}