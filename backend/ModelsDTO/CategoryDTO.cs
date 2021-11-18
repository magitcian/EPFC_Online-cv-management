using System;
using System.Collections.Generic;

namespace prid2122_g03.Models
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        // public ICollection<Skill> Skills { get; set; }
    }

    public class CategoryWithSkillsDTO : CategoryDTO
    {
        public ICollection<Skill> Skills { get; set; }
    }

}
