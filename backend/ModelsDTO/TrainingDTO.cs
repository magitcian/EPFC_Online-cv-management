using System;
using System.Collections.Generic;

namespace prid2122_g03.Models
{
    public class TrainingDTO : ExperienceDTO
    {

    }

    public class TrainingWithEnterprisesAndUsingsDTO : TrainingDTO
    {
        public EnterpriseDTO Enterprise { get; set; }
        public ICollection<UsingWithSkillDTO> Usings { get; set; }
    }

    public class TrainingWithUserDTO : TrainingDTO
    {
        public UserDTO User { get; set; }
    }

        public class TrainingWithUsingsDTO : TrainingDTO
    {
        public ICollection<UsingDTO> Usings { get; set; }
    }

}