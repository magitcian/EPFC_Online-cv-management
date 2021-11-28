using System;
using System.Collections.Generic;

namespace prid2122_g03.Models
{
    public class MasteringDTO
    {
        public int Id { get; set; }

        public Level Level { get; set; }
    }

    public class MasteringWithSkillDTO : MasteringDTO
    {
        public SkillWithCategoryDTO Skill { get; set; }
    }


}
