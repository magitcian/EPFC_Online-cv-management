using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid2122_g03.Models
{

    public class Enterprise : IValidatableObject
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Experience> Experiences { get; set; } = new HashSet<Experience>();
        public virtual ICollection<Mission> Missions { get; set; } = new HashSet<Mission>();
        public Enterprise(string name) {
            Name = name;
        }
        public Enterprise() {

        }

        public bool CheckName(CvContext context) {
            return this.Name != "";
        }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(CvContext)) as CvContext;
            Debug.Assert(currContext != null);
            if (!CheckName(currContext))
                yield return new ValidationResult("The name must be completed!", new[] { nameof(Name) });
        }
    }
}