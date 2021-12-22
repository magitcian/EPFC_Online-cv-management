using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema; // propr [NotMapped]


namespace prid2122_g03.Models
{

    public class Using //: IValidatableObject
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(Experience))]
        public int ExperienceId { get; set; }

        public Experience Experience { get; set; }

        [Required]
        [ForeignKey(nameof(Skill))]
        public int SkillId { get; set; }

        public Skill Skill { get; set; }

        public Using() {
        }

        public Using(Experience experience, Skill skill) { // , int id = 0) {
            this.Experience = experience;
            this.Skill = skill;
        }

    }

}