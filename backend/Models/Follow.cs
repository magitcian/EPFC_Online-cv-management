using System.ComponentModel.DataAnnotations;

namespace prid2122_g03.Models
{
    public class Follow
    {
        [Required]
        public string FollowerPseudo { get; set; }
        [Required]
        public Member Follower { get; set; }
        [Required]
        public string FolloweePseudo { get; set; }
        [Required]
        public Member Followee { get; set; }
    }
}
