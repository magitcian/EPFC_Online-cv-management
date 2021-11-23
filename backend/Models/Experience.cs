using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid2122_g03.Models
{

    public class Experience //: IValidatableObject
    {
        [Key]
        public int Id { get; set; }

        public DateTime? Start { get; set; }
        public DateTime? Finish { get; set; }
        [MinLength(3, ErrorMessage = "Minimum 3 characters")]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        [ForeignKey(nameof(Enterprise))]
        public int EnterpriseId { get; set; } 
        [Required]
        public Enterprise Enterprise { get; set; } 

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; } 
        [Required]
        public User User { get; set; } 

        public ICollection<Skill> Skills { get; set; } = new HashSet<Skill>(); //lien Using //en attentante du skill de ines

        public Experience(DateTime start, DateTime finish, string title, string description, Enterprise enterprise):this(start, finish, title, description) {
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
    }
}