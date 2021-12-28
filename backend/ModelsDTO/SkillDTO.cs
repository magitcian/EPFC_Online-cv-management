using System;
using System.Collections.Generic;

namespace prid2122_g03.Models
{
    public class SkillDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CategoryId { get; set; }

        // public CategoryDTO Category { get; set; } // not sure bc it is a foreign key so we may end up with a loop
        // public ICollection<MasteringDTO> MasteringSkillsLevels { get; set; } 
    }

    public class SkillWithMasteringsDTO : SkillDTO
    {
        // public MasteringWithUserDTO Mastering { get; set; }
        public ICollection<MasteringWithUserDTO> MasteringSkillsLevels { get; set; } 
    }

    public class SkillWithCategoryDTO : SkillDTO
    {
        public CategoryDTO Category { get; set; }
    }
    
    public class SkillWithUsingsDTO : SkillDTO
    {
        public ICollection<UsingWithExperienceDTO> Usings { get; set; } 
    }

}
