using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema; // propr [NotMapped]


namespace prid2122_g03.Models
{

    public enum Level 
    {
        Expert = 0, Senior = 1, Medior = 2, Junior = 3, Starter = 4
    }

    public class Mastering //: IValidatableObject
    {
        public Level Level { get; set; } = Level.Starter;

        [Required]
        [ForeignKey(nameof(User))]
        public User UserId { get; set; } 

        [Required]
        [ForeignKey(nameof(Skill))]
        public User SkillId { get; set; } 

        public Mastering() {
        } 

    }

}