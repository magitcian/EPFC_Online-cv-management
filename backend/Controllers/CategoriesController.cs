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
    public class CategoriesController : ControllerBase
    {
        private readonly CvContext _context;
        private readonly IMapper _mapper;

        /*
        Le contrôleur est instancié automatiquement par ASP.NET Core quand une requête HTTP est reçue.
        Les deux paramètres du constructeur recoivent automatiquement, par injection de dépendance, 
        une instance du context EF (MsnContext) et une instance de l'auto-mapper (IMapper).
        */

        public CategoriesController(CvContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }

        // GET /api/categories
        [Authorized(Title.AdminSystem)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetAll() {
            return _mapper.Map<List<CategoryDTO>>(await _context.Categories.ToListAsync());
        }

        // GET /api/categories/{categoryID}
        [Authorized(Title.AdminSystem)]
        [HttpGet("{categoryID}")]
        public async Task<ActionResult<CategoryDTO>> GetOne(int categoryID) {
            // Récupère en BD le membre dont l'id est passé en paramètre dans l'url
            var category = await _context.Categories.FindAsync(categoryID);
            // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
            if (category == null)
                return NotFound();
            // Transforme le membre en son DTO et retourne ce dernier
            return _mapper.Map<CategoryDTO>(category);
        }

        // POST /api/categories
        [Authorized(Title.AdminSystem)]
        [HttpPost]
        public async Task<ActionResult<CategoryDTO>> PostCategory(CategoryDTO category) {
            // Utilise le mapper pour convertir le DTO qu'on a reçu en une instance de User
            var newCategory = _mapper.Map<Category>(category);
            // Ajoute ce nouveau membre au contexte EF
            _context.Categories.Add(newCategory);
            // Sauve les changements
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            // find back the user from the DB to use the actual id
            //var userDB = await _context.Users.SingleOrDefaultAsync(u => u.Email == newUser.Email);
            // Renvoie une réponse ayant dans son body les données du nouveau membre (3ème paramètre)
            // et ayant dans ses headers une entrée 'Location' qui contient l'url associé à GetOne avec la bonne valeur 
            // pour le paramètre 'email' de cet url.
            return CreatedAtAction(nameof(GetOne), new { categoryID = newCategory.Id }, _mapper.Map<CategoryDTO>(newCategory));
        }


        // PUT /api/categories
        [Authorized(Title.AdminSystem)]
        [HttpPut]
        public async Task<IActionResult> PutCategory(CategoryDTO dto) {
            var category = await _context.Categories.FindAsync(dto.Id);
            var isAdmin = User.IsInRole(Title.AdminSystem.ToString()); // boolean
            // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
            if (category == null)
                return NotFound();
            // Mappe les données reçues sur celles du membre en question
            _mapper.Map<CategoryDTO, Category>(dto, category);
            // Sauve les changements
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            // Retourne un statut 204 avec une réponse vide
            return NoContent();
        }


        // DELETE /api/categories/{categoryID} 
        [Authorized(Title.AdminSystem)]
        [HttpDelete("{categoryID}")]
        public async Task<IActionResult> DeleteUser(int categoryID) {
            // Récupère en BD le membre à supprimer
            var category = await _context.Categories.FindAsync(categoryID);
            // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
            if (category == null)
                return NotFound();
            // Indique au contexte EF qu'il faut supprimer ce membre
            _context.Categories.Remove(category);
            // Sauve les changements
            await _context.SaveChangesAsync();
            // Retourne un statut 204 avec une réponse vide
            return NoContent();
        }

    }
}
