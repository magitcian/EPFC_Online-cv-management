using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema; // propr [NotMapped]


namespace prid2122_g03.Models
{
    public class Manager : User //: IValidatableObject
    {
        public ICollection<Consultant> Consultants { get; set; } = new HashSet<Consultant>();

        public Manager() {
        } 
    }

}