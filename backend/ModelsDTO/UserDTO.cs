using System;
using System.Collections.Generic;

namespace prid2122_g03.Models
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public DateTime? BirthDate { get; set; }
        public Title Title { get; set; } = Title.JuniorConsultant;
        public string Token { get; set; }

        // public ICollection<Mastering> MasteringSkillsLevels { get; set; }  // TODO ask Sev
        // public ICollection<Experience> Experiences { get; set; } 
    }

    public class UserWithPasswordDTO : UserDTO
    {
        public string Password { get; set; }
    }

    public class UserWithExperiencesDTO : UserDTO
    {
        public ICollection<ExperienceDTO> Experiences { get; set; }
        
    }

    public class UserWithMasteringsDTO : UserDTO
    {
        public ICollection<MasteringDTO> MasteringSkillsLevels { get; set; } // TODO ask Sev
        
    }

    public class UserWithExperiencesWithMasteringsDTO : UserWithExperiencesDTO
    {
        public ICollection<MasteringWithSkillDTO> MasteringSkillsLevels { get; set; } // TODO ask Sev
    }

}
