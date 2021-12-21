using System;
using System.Collections.Generic;

namespace prid2122_g03.Models
{
    public class MissionDTO : ExperienceDTO
    {
        public int ClientId { get; set; }
        //public EnterpriseDTO Client { get; set; }
    }

    public class MissionWithEnterprisesDTO : MissionDTO
    {
        public EnterpriseDTO Enterprise { get; set; }
        public EnterpriseDTO Client { get; set; }
        public ICollection<UsingWithSkillDTO> Usings { get; set; }
    }

    public class MissionWithUserDTO : MissionDTO
    {
        public UserDTO User { get; set; }
    }

        public class MissionWithUsingsDTO : MissionDTO
    {
        public ICollection<UsingDTO> Usings { get; set; }
    }
}