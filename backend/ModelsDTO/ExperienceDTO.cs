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
        public virtual EnterpriseDTO Enterprise { get; set; }


    }

}