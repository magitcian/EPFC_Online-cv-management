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

    public class Training : Experience //: IValidatableObject // TODO add validation for Grade
    {
        public Grade Grade { get; set; }
        
        public Training(DateTime start, DateTime finish, string title, string description, Enterprise enterprise, Grade grade) : base(start, finish, title, description, enterprise) {
            Grade = grade;
        } // entreprise should be the school / university

        public Training() {

        }

    }
}