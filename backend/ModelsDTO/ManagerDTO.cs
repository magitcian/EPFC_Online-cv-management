using System;
using System.Collections.Generic;

namespace prid2122_g03.Models
{
    public class ManagerDTO : UserDTO
    {
        // public ICollection<ConsultantDTO> Consultants { get; set; }
        
    }

    public class ManagerWithConsultantsDTO : ManagerDTO // or directly ManagerDTO : UserDTO 
    {
        public ICollection<ConsultantDTO> Consultants { get; set; }
        
    }

    public class ManagerWithExperiencesWithMasteringsWithConsultantsDTO : UserWithExperiencesWithMasteringsDTO 
    {
        public ICollection<ConsultantDTO> Consultants { get; set; }
        
    }

    

}
