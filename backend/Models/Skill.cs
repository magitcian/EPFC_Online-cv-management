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
    public class Skill : IValidatableObject 
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Required"), MinLength(2, ErrorMessage = "Minimum 2 characters")]
        public string Name { get; set; }

        // [Required]
        [ForeignKey(nameof(Category))]
        public int? CategoryId { get; set; } 

        //[Required]
        public Category Category { get; set; } 

        public ICollection<Mastering> MasteringSkillsLevels { get; set; } = new HashSet<Mastering>();
        //public ICollection<Experience> Experiences { get; set; } = new HashSet<Experience>(); 
        public ICollection<Using> Usings { get; set; } = new HashSet<Using>();
        
        public Skill() {
        } 

        // public Skill(string name) {
        //     Name = name;
        // } 

        public Skill(string name, Category category) { 
            Name = name;
            Category = category;
        }

        public bool CheckNameUnicity(CvContext context) {
            // if (string.IsNullOrEmpty(Name))
            //     return true;
            return context.Skills.Count(s => s.Id != Id && s.Name == Name) == 0; 
        }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(CvContext)) as CvContext;
            Debug.Assert(currContext != null);
            if (!CheckNameUnicity(currContext))
                yield return new ValidationResult("The name of a skill must be unique", new[] { nameof(Name) });
        }

    }

}