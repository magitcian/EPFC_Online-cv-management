using System;

namespace prid2122_g03.Models
{
    public class ExperienceDTO
    {
        public int Id { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? Finish { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int UserId { get; set; }
        public int EnterpriseId { get; set; }
        //public EnterpriseDTO Enterprise { get; set; }
    }

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