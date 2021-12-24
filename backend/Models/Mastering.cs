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
        Starter = 1, Junior = 2, Medior = 3, Senior = 4, Expert = 5
    }

    public class Mastering : IValidatableObject 
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Level Level { get; set; } = Level.Starter;

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; } 

        // [Required]
        public User User { get; set; } 

        [Required]
        [ForeignKey(nameof(Skill))]
        public int SkillId { get; set; } 

        // [Required]
        public Skill Skill { get; set; } 

        public Mastering() {
        } 

        public Mastering(Level level, User user, Skill skill) { // , int id = 0) {
            Level = level;
            User = user;
            Skill = skill;
        } 

        // public Mastering(Level level) { // , int id = 0) {
        //     Level = level;
        // }

        public bool CheckSkillUnicityByUser(CvContext context) {
            // return context.Masterings.Count(m => m.UserId == UserId && m.SkillId == SkillId) == 0;   
            return context.Entry(this).State == EntityState.Modified || 
                context.Masterings.AsNoTracking().Count(m => m.UserId == UserId && m.SkillId == SkillId) == 0;
        }

        // public bool CheckLevelInput() {
        //     // if (Enum.GetValues(typeof(Level))
        //     return true; 
        // }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(CvContext)) as CvContext;
            Debug.Assert(currContext != null);
            if (!CheckSkillUnicityByUser(currContext))
                yield return new ValidationResult("You already have this skill", new[] { nameof(SkillId) }); // new[] { nameof(SkillId) });
            // if (!CheckLevelInput())
            //     yield return new ValidationResult("The level is between 1 and 5", new[] { nameof(Level) }); 
            // return null;   
        }

        // TODO check level is within 1-5 => Level.value

    }

}