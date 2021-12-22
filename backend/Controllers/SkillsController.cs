using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid2122_g03.Models;
using AutoMapper;
using PRID_Framework;
using prid2122_g03.Helpers;
using System.Text.Json;

namespace prid2122_g03.Controllers
{
    [Authorize] // indique qu'il faut être authentifié, mais accepte tous les rôles
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsController : ControllerBase
    {
        private readonly CvContext _context;
        private readonly IMapper _mapper;

        /*
        Le contrôleur est instancié automatiquement par ASP.NET Core quand une requête HTTP est reçue.
        Les deux paramètres du constructeur recoivent automatiquement, par injection de dépendance, 
        une instance du context EF (MsnContext) et une instance de l'auto-mapper (IMapper).
        */

        public SkillsController(CvContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }

        private async Task<User> getConnectedUser() {
            int connectedID = 0;
            if (Int32.TryParse(User.Identity.Name, out int ID)) {
                connectedID = ID;
            }
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == connectedID);
        }

        private async Task<bool> isConnectedUserOrAdmin(int userID) {
            var connectedUser = getConnectedUser();
            var user = await _context.Users.FindAsync(userID);
            var isAdmin = User.IsInRole(Title.AdminSystem.ToString());
            return isAdmin || (user != null && user.Id == connectedUser.Result.Id);
        }

        private async Task<bool> isConnectedUser(int userID) {
            var connectedUser = getConnectedUser();
            var user = await _context.Users.FindAsync(userID);
            return user != null && user.Id == connectedUser.Result.Id;
        }

        // TODO how to find manager
        // private async Task<bool> isConnectedUserManager(int userID) {
        //     //var connectedUser = getConnectedUser();
        //     var connectedUser = await _context.Users.FindAsync(getConnectedUser().Result.Id);
        // }

        // GET /api/skills
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SkillWithCategoryDTO>>> GetAll() {
            return _mapper.Map<List<SkillWithCategoryDTO>>(await _context.Skills.Include(s => s.Category).ToListAsync());
            // return _mapper.Map<List<SkillWithCategoryDTO>>(await _context.Skills.ToListAsync());
        }


        // GET /api/skills/{skillID}
        [HttpGet("{skillID}")]
        public async Task<ActionResult<SkillWithCategoryDTO>> GetOne(int skillID) {
            var skill = await _context.Skills
                                .Include(s => s.Category)
                                .SingleAsync(s => s.Id == skillID);
            return _mapper.Map<SkillWithCategoryDTO>(skill);          
        }


        // DELETE /api/skills/{skillID} 
        [AllowAnonymous]
        [HttpDelete("{skillID}")]
        public async Task<IActionResult> DeleteSkill(int skillID) {
            // Récupère en BD la skill à supprimer
            var skill = await _context.Skills.FindAsync(skillID);
            // Si aucune skill n'a été trouvé, renvoyer une erreur 404 Not Found
            if (skill == null)
                return NotFound();
            // Si aucune skill n'a été trouvé, renvoyer une erreur 404 Not Found    
            // if (isConnectedUserOrAdmin(getConnectedUser().Id).Result) { // TODO ask Sev (what if an admin remove a skill of another user)
                // Indique au contexte EF qu'il faut supprimer cette skill
                _context.Skills.Remove(skill);
                // Sauve les changements
                await _context.SaveChangesAsync();
                // Retourne un statut 204 avec une réponse vide
                return NoContent();
            // }
            // return BadRequest("You are not entitled to remove those data");
        }

    }
}
