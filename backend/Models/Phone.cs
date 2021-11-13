using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid2122_g03.Models
{
    public class Phone
    {
        public int PhoneId { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public string Number { get; set; }
        [Required]
        [ForeignKey(nameof(Member))]
        public string MemberPseudo { get; set; }
        [Required]
        public Member Member { get; set; }
    }
}
