using System;
using System.Collections.Generic;

namespace prid2122_g03.Models
{
    public class SkillDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // public Category Category { get; set; } // not sure bc it is a foreign key so we may end up with a loop
        // public ICollection<Mastering> MasteringSkillsLevels { get; set; } // TODO ask Sev
    }

    public class SkillWithMasteringsDTO : SkillDTO
    {
        public ICollection<MasteringDTO> MasteringSkillsLevels { get; set; } // TODO ask Sev
    }

    public class SkillWithCategoryDTO : SkillDTO
    {
        public CategoryDTO Category { get; set; }
    }


}
