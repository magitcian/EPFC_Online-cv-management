using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema; // propr [NotMapped]


namespace prid2122_g03.Models
{
    public enum Title
    {
        SeniorManager = 0, MediorManager = 1, JuniorManager = 2, SeniorConsultant = 3, MediorConsultant = 4, JuniorConsultant = 5
    }

    public abstract class User //: IValidatableObject
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Required")]
        [MinLength(3, ErrorMessage = "Minimum 3 characters")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Required")]
        [MinLength(3, ErrorMessage = "Minimum 3 characters")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Required")]
        [MinLength(3, ErrorMessage = "Minimum 3 characters"), EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "Required")]
        [MinLength(3, ErrorMessage = "Minimum 3 characters")]
        public string Password { get; set; }
        [MinLength(3, ErrorMessage = "Minimum 3 characters")]
        
        public DateTime? BirthDate { get; set; }

        public Title Title { get; set; } = Title.JuniorConsultant;

        // public Mastering Mastering { get; set; } 
        // public Skill Skill { get; set; } 
        // public ICollection<Skill> Skills { get; set; } = new HashSet<Skill>();

        //[NotMapped]
        //public string Token { get; set; }

        public User() {
        } 

        // test int id = 0 dans le constructeur => vérifier que ça fonctionne
        
        public User(string lastName, string firstName, string email, string password, int id = 0) {
            LastName = lastName;
            FirstName = firstName;
            Email = email;
            Password = password;
        } 
        public User(string lastName, string firstName, string email, string password) { //, int id = 0) {
            LastName = lastName;
            FirstName = firstName;
            Email = email;
            Password = password;
        } 

        // public User(string lastName, string firstName, string email, string password, DateTime birthDate, Title title) {
        //     LastName = lastName;
        //     FirstName = firstName;
        //     Email = email;
        //     Password = password;
        //     BirthDate = birthDate;
        //     title = Title;
        // } 

        public int? Age {
            get {
                if (!BirthDate.HasValue)
                    return null;
                var today = DateTime.Today;
                var age = today.Year - BirthDate.Value.Year;
                if (BirthDate.Value.Date > today.AddYears(-age)) age--;
                return age;
            }
        }

    }
}        