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

        // public bool CheckGradeInput() {  // TODO to review and check in postman (maybe to add in User for Title too)
        //     foreach (int i in Enum.GetValues(typeof(Grade))) { // int SummaCumLaude = (int) Grade.SummaCumLaude;
        //         if (i >= 0 && i <= 2)
        //             return true;
        //     }
        //     return false; 
        // }

        // public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
        //     var currContext = validationContext.GetService(typeof(CvContext)) as CvContext;
        //     Debug.Assert(currContext != null);
        //     if (!CheckGradeInput())
        //         yield return new ValidationResult("The grade is between 0 and 2", new[] { nameof(Grade) });  
        // }

    }
}