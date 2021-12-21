using System;
using System.Collections.Generic;

namespace prid2122_g03.Models
{
    public class UsingDTO
    {
        public int Id { get; set; }

        public int ExperienceId { get; set; } 

        public int SkillId { get; set; } 

    }

    public class UsingWithSkillDTO : UsingDTO
    {
        public SkillWithCategoryDTO Skill { get; set; }
    }

    public class UsingWithExperienceDTO : UsingDTO
    {
        public ExperienceDTO Experience { get; set; }
    }

    public class UsingWithSkillAndExperienceDTO : MasteringWithSkillDTO
    {
        public ExperienceDTO Experience { get; set; }
    }


}
