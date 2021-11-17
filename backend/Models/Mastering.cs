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
        Starter = 0, Junior = 1, Medior = 2, Senior = 4, Expert = 5
    }

    public class Mastering //: IValidatableObject
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Level Level { get; set; } = Level.Starter;

        // public int Level { get; set; }   // TODO ask Séverine

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; } 

        [Required]
        public User User { get; set; } 

        [Required]
        [ForeignKey(nameof(Skill))]
        public int SkillId { get; set; } 

        [Required]
        public Skill Skill { get; set; } 

        public Mastering() {
        } 

        public Mastering(Level level, User user, Skill skill) { // , int id = 0) {
            Level = level;
            User = user;
            Skill = skill;
        } 

    }

}