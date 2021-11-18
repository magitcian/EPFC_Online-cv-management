using System;
using System.Collections.Generic;

namespace prid2122_g03.Models
{
    public class ManagerDTO : UserDTO
    {
        // public ICollection<Consultant> Consultants { get; set; }
        
    }

    public class ManagerWithConsultantsDTO : ManagerDTO // or directly ManagerDTO : UserDTO // TODO ask Sev
    {
        public ICollection<Consultant> Consultants { get; set; }
        
    }

    public class ManagerWithExperiencesWithMasteringsWithConsultantsDTO : UserWithExperiencesWithMasteringsDTO 
    {
        public ICollection<Consultant> Consultants { get; set; }
        
    }

    

}
