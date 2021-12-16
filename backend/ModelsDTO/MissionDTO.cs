using System;

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
    }

    public class MissionWithUserDTO : MissionDTO
    {
        public UserDTO User { get; set; }
    }
}