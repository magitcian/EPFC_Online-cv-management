using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid2122_g03.Models
{

        public enum Grade
    {
        SummaCumLaude = 0, MagnaCumLaude = 1, CumLaude = 2
    }

    public class Training : Experience 
    {
        public Grade Grade { get; set; }
        
        public Training(DateTime start, DateTime finish, string title, string description, Enterprise enterprise, Grade grade) : base(start, finish, title, description, enterprise) {
            Grade = grade;
        } // entreprise should be the school / university

        public Training() {

        }

        public bool CheckGradeInput() {  
            foreach (int i in Enum.GetValues(typeof(Grade))) { // int SummaCumLaude = (int) Grade.SummaCumLaude;
                if (this.Grade.Equals((Grade)Enum.ToObject(typeof(Grade), i)))
                    return true;
            }
            return false; 
        }


        public override IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var results = base.Validate(validationContext).ToList();
            var currContext = validationContext.GetService(typeof(CvContext)) as CvContext;
            Debug.Assert(currContext != null);
            if (!CheckGradeInput())
                results.Add(new ValidationResult("The grade is between 0 and 2", new[] { nameof(Grade) }));  
            return results;
        }

    }
}