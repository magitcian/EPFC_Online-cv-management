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

    // TODO ask Séverine: remove RoleUser but add Admin in Title
    // public enum Title
    // {
    //     Admin = 0, SeniorManager = 1, MediorManager = 2, JuniorManager = 3, SeniorConsultant = 4, MediorConsultant = 5, JuniorConsultant = 6
    // }
    public enum RoleUser
    {
        Admin = 0, Manager = 1, Consultant = 2
    }

    public abstract class User : IValidatableObject
    {
        [Key]
        public int Id { get; set; }
       
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Last name has to be between 3 and 50 characters")]
        public string LastName { get; set; }

        [StringLength(50, MinimumLength = 3, ErrorMessage = "First name has to be between 3 and 50 characters")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Required"), EmailAddress(ErrorMessage = "This is not a valid email address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Required"), StringLength(10, MinimumLength = 3, ErrorMessage = "Password has to be between 3 and 10 characters")] 
        public string Password { get; set; }
        
        public DateTime? BirthDate { get; set; }

        public Title Title { get; set; } = Title.JuniorConsultant;

        public RoleUser RoleUser { get; set; } = RoleUser.Consultant;

        [NotMapped]
        public string Token { get; set; }

        // TODO ask Sev: shall we keep the name or better to use "Masterings"
        public ICollection<Mastering> MasteringSkillsLevels { get; set; } = new HashSet<Mastering>();

        public ICollection<Experience> Experiences { get; set; } = new HashSet<Experience>();


        public User() {
        } 
 
        public User(string email, string password) { //, int id = 0) { => vérifier que ça fonctionne
            Email = email;
            Password = password;
        } 
        public User(string lastName, string firstName, string email, string password) : this(email, password) {
            LastName = lastName;
            FirstName = firstName;
        } 

        // Constructors: not yet used
        // public User(string lastName, string firstName, string email, string password, DateTime birthDate) : this(lastName, firstName, email, password) {
        //     BirthDate = birthDate;
        // } 

        // public User(string lastName, string firstName, string email, string password, DateTime birthDate, Title title) 
        //             : this(lastName, firstName, email, password, birthDate) {
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

        public bool CheckEmailUnicity(CvContext context) {
            /*
            Vérifie si, en cas d'ajout d'un membre, il existe déjà un membre ayant le même email que celui qu'on veut créer.
            L'appel à AsNoTracking() permet d'indiquer à EF qu'on veut contourner le contexte en allant lire directement en BD.
            */
            return context.Entry(this).State == EntityState.Modified || 
                    context.Users.AsNoTracking().Count(u => u.Id != Id && u.Email == Email) == 0;
            // TODO ask Séverine
            // return context.Users.Count(u => u.Id != Id && u.Email == Email) == 0;    // not sure which one is the best
        }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(CvContext)) as CvContext;
            Debug.Assert(currContext != null);
            if (!CheckEmailUnicity(currContext))
                yield return new ValidationResult("The email address of a user must be unique", new[] { nameof(Email) });
            if ((LastName == null && FirstName != null) || (LastName != null && FirstName == null))
                yield return new ValidationResult("The last name and first name are required once one of them is not null", new[] { nameof(LastName) });
            if (BirthDate.HasValue && BirthDate.Value.Date > DateTime.Today)
                yield return new ValidationResult("Can't be born in the future in this reality", new[] { nameof(BirthDate) });
            else if (Age.HasValue && Age < 18)
                yield return new ValidationResult("Must be 18 years old", new[] { nameof(BirthDate) });
        }

    }
}        