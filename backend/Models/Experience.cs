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
        //[ForeignKey(nameof(Enterprise))]
        public virtual Enterprise Enterprise { get; set; }
        public virtual Mission Mission { get; set; }
        //public virtual User User { get; set; } //en attentante du user de ines
        //public virtual ICollection<Skill> Skills { get; set; } = new HashSet<Skill>(); //lien Using //en attentante du skill de ines

        public Experience(DateTime start, DateTime finish, string title, string description ) {
            Start = start;
            Finish = finish;
            Title = title;
            Description = description;
            //Enterprise = enterprise;
        }

        public Experience() {

        }
    }
}