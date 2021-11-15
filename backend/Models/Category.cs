using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema; // propr [NotMapped]


namespace prid2122_g03.Models
{
    public class Category //: IValidatableObject
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Required")]
        [MinLength(3, ErrorMessage = "Minimum 3 characters")]
        public string Name { get; set; }

        public ICollection<Skill> Skills { get; set; } = new HashSet<Skill>();

        public Category() {
        } 

        // public Category(string name, int id = 0) {
        //     Name = name;
        //     Id = id;
        // } 

        public Category(string name) { // , int id = 0) {
            Name = name;
        } 


    }

}