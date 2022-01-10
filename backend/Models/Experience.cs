using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid2122_g03.Models
{

    public abstract class Experience : IValidatableObject
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public DateTime? Start { get; set; }

        public DateTime? Finish { get; set; }
        [MinLength(3, ErrorMessage = "Minimum 3 characters")]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        [ForeignKey(nameof(Enterprise))]
        public int EnterpriseId { get; set; }
        //[Required]
        public Enterprise Enterprise { get; set; }

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        //[Required]
        public User User { get; set; }

        //public ICollection<Skill> Skills { get; set; } = new HashSet<Skill>(); //lien Using 
        public ICollection<Using> Usings { get; set; } = new HashSet<Using>();

        public Experience(DateTime start, DateTime finish, string title, string description, Enterprise enterprise) : this(start, finish, title, description) {
            Enterprise = enterprise;
        }

        public Experience(DateTime start, DateTime finish, string title, string description) {
            Start = start;
            Finish = finish;
            Title = title;
            Description = description;
        }

        public Experience() {

        }

        public virtual IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(CvContext)) as CvContext;
            Debug.Assert(currContext != null);
            if (this.Title == null)
                yield return new ValidationResult("Title muste be completed", new[] { nameof(this.Title) });
            if (this.Finish != null && this.Start > this.Finish)
                yield return new ValidationResult("Start date must be lower than finish date!", new[] { nameof(this.Start) });
            if (this.Start.Value.Year <= 1990)
                yield return new ValidationResult("Start date must be realistic!", new[] { nameof(this.Start) });
            if (this.Finish != null && this.Finish.Value.Year <= 1990)
                yield return new ValidationResult("Finish date must be realistic!", new[] { nameof(this.Finish) });
            // if (this.Start.Value.Year <= this.User.BirthDate.Value.AddYears(18).Year) //Ne peut pas commencer avant ses 18 ans?
            //     yield return new ValidationResult("Start date must be realistic!", new[] { nameof(this.Start) });

        }

    }
}