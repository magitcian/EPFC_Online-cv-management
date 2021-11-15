using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema; // propr [NotMapped]
//using System.Collections.Generic;


namespace prid2122_g03.Models
{
    public class Skill //: IValidatableObject
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Required")]
        [MinLength(3, ErrorMessage = "Minimum 3 characters")]
        public string Name { get; set; }

        [Required]
        [ForeignKey(nameof(Category))]
        public Category CategoryId { get; set; } // Category or CategoryName

        public Skill() {
        } 

        public Skill(string name) {
            Name = name;
        } 

        // add constructor with category ?


    }

}