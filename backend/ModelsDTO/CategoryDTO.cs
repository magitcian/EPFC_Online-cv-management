using System;
using System.Collections.Generic;

namespace prid2122_g03.Models
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        // public ICollection<SkillDTO> Skills { get; set; }
    }

    public class CategoryWithSkillsDTO : CategoryDTO
    {
        public ICollection<SkillDTO> Skills { get; set; }
    }

    public class CategoryWithSkillsAndMasteringsDTO : CategoryDTO
    {
        public ICollection<SkillWithMasteringsDTO> Skills { get; set; }
    }

    public class CategoryWithSkillsAndUsingsDTO : CategoryDTO
    {
        public ICollection<SkillWithUsingsDTO> Skills { get; set; }
    }

}
