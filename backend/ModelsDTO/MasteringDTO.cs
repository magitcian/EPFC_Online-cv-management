using System;
using System.Collections.Generic;

namespace prid2122_g03.Models
{
    public class MasteringDTO
    {
        public int Id { get; set; }

        public Level Level { get; set; }

        public int UserId { get; set; } 

        public int SkillId { get; set; } 

    }

    public class MasteringWithSkillDTO : MasteringDTO
    {
        public SkillWithCategoryDTO Skill { get; set; }
    }

    public class MasteringWithUserDTO : MasteringDTO
    {
        public UserDTO User { get; set; }
    }

    public class MasteringWithSkillAndUserDTO : MasteringWithSkillDTO
    {
        public UserDTO User { get; set; }
    }


}
