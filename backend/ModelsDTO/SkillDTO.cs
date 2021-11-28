using System;
using System.Collections.Generic;

namespace prid2122_g03.Models
{
    public class SkillDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // public CategoryDTO Category { get; set; } // not sure bc it is a foreign key so we may end up with a loop
        // public ICollection<MasteringDTO> MasteringSkillsLevels { get; set; } 
    }

    public class SkillWithMasteringsDTO : SkillDTO
    {
        public ICollection<MasteringDTO> MasteringSkillsLevels { get; set; } 
    }

    public class SkillWithCategoryDTO : SkillDTO
    {
        public CategoryDTO Category { get; set; }
    }

    // public class SkillWithUsingsDTO : SkillDTO
    // {
    //     public ICollection<UsingDTO> Usings { get; set; } 
    // }


}
