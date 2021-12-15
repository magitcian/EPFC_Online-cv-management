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
        [AllowAnonymous] // to unprotect this method 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SkillWithCategoryDTO>>> GetAll() {
            return _mapper.Map<List<SkillWithCategoryDTO>>(await _context.Skills.Include(s => s.Category).ToListAsync());
            // return _mapper.Map<List<SkillWithCategoryDTO>>(await _context.Skills.ToListAsync());
        }


        // GET /api/skills
        // // GET /api/categories/{categoryID}
        // [Authorized(Title.AdminSystem)]
        // [HttpGet("{categoryID}")]
        // public async Task<ActionResult<CategoryDTO>> GetOne(int categoryID) {
        //     // Récupère en BD le membre dont l'id est passé en paramètre dans l'url
        //     var category = await _context.Categories.FindAsync(categoryID);
        //     // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
        //     if (category == null)
        //         return NotFound();
        //     // Transforme le membre en son DTO et retourne ce dernier
        //     return _mapper.Map<CategoryDTO>(category);
        // }

        // // POST /api/categories
        // [Authorized(Title.AdminSystem)]
        // [HttpPost]
        // public async Task<ActionResult<CategoryDTO>> PostCategory(CategoryDTO category) {
        //     // Utilise le mapper pour convertir le DTO qu'on a reçu en une instance de User
        //     var newCategory = _mapper.Map<Category>(category);
        //     // Ajoute ce nouveau membre au contexte EF
        //     _context.Categories.Add(newCategory);
        //     // Sauve les changements
        //     var res = await _context.SaveChangesAsyncWithValidation();
        //     if (!res.IsEmpty)
        //         return BadRequest(res);
        //     // find back the user from the DB to use the actual id
        //     //var userDB = await _context.Users.SingleOrDefaultAsync(u => u.Email == newUser.Email);
        //     // Renvoie une réponse ayant dans son body les données du nouveau membre (3ème paramètre)
        //     // et ayant dans ses headers une entrée 'Location' qui contient l'url associé à GetOne avec la bonne valeur 
        //     // pour le paramètre 'email' de cet url.
        //     return CreatedAtAction(nameof(GetOne), new { categoryID = newCategory.Id }, _mapper.Map<CategoryDTO>(newCategory));
        // }


        // // PUT /api/categories
        // [Authorized(Title.AdminSystem)]
        // [HttpPut]
        // public async Task<IActionResult> PutCategory(CategoryDTO dto) {
        //     var category = await _context.Categories.FindAsync(dto.Id);
        //     var isAdmin = User.IsInRole(Title.AdminSystem.ToString()); // boolean
        //     // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
        //     if (category == null)
        //         return NotFound();
        //     // Mappe les données reçues sur celles du membre en question
        //     _mapper.Map<CategoryDTO, Category>(dto, category);
        //     // Sauve les changements
        //     var res = await _context.SaveChangesAsyncWithValidation();
        //     if (!res.IsEmpty)
        //         return BadRequest(res);
        //     // Retourne un statut 204 avec une réponse vide
        //     return NoContent();
        // }


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
