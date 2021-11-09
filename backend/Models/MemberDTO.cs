using System;

namespace prid2122_g03.Models
{
    public class MemberDTO
    {
        public string Pseudo { get; set; }
        public string FullName { get; set; }
        public DateTime? BirthDate { get; set; }
        public Role Role { get; set; }
        public string Token { get; set; }

    }

    public class MemberWithPasswordDTO : MemberDTO
    {
        public string Password { get; set; }
    }
}