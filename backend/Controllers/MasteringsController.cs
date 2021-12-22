using System;
using System.Collections.Generic;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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
    public class MasteringsController : ControllerBase
    {
        private readonly CvContext _context;
        private readonly IMapper _mapper;

        /*
        Le contrôleur est instancié automatiquement par ASP.NET Core quand une requête HTTP est reçue.
        Les deux paramètres du constructeur recoivent automatiquement, par injection de dépendance, 
        une instance du context EF (MsnContext) et une instance de l'auto-mapper (IMapper).
        */

        public MasteringsController(CvContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }
    
        private int getConnectedUserId() {
            int connectedID = 0;
            if (Int32.TryParse(User.Identity.Name, out int ID)) {
                connectedID = ID;
            }
            return connectedID;
        }
        private User getConnectedUser() {
            return _context.Users.FirstOrDefault(u => u.Id == getConnectedUserId());
        }

        private bool isConnectedUser(int userID) {
            var connectedUser = getConnectedUser();
            var user = _context.Users.Find(userID);
            return user != null && user.Id == connectedUser.Id;
        }

        // private bool isAdmin() {
        //     return User.IsInRole(Title.AdminSystem.ToString());
        // }

        // private bool isManager() {
        //     return User.IsInRole(Title.Manager.ToString());
        // }

        // GET /api/masterings  
        [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpGet]

        public async Task<ActionResult<IEnumerable<MasteringDTO>>> GetAll() {   // TODO: check if needed be
            return _mapper.Map<List<MasteringDTO>>(await _context.Masterings.ToListAsync());
        }


        // GET /api/masterings/{masteringID}
        [Authorized(Title.AdminSystem, Title.Manager, Title.Consultant)] // TODO Title.Consultant: to check with Sev
        [HttpGet("{masteringID}")]
        public async Task<ActionResult<MasteringDTO>> GetOne(int masteringID) { // TODO: check with PostMastering
            // Récupère en BD le membre dont l'id est passé en paramètre dans l'url
            var mastering = await _context.Masterings.FindAsync(masteringID);
            // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
            if (mastering == null)
                return NotFound();
            // Transforme le membre en son DTO et retourne ce dernier
            return _mapper.Map<MasteringDTO>(mastering);
        }

        // POST /api/masterings
        // [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpPost]
        public async Task<ActionResult<MasteringDTO>> PostMastering(MasteringDTO mastering) {
            // Utilise le mapper pour convertir le DTO qu'on a reçu en une instance de Mastering
            var newMastering = _mapper.Map<Mastering>(mastering);
            // Assigne l'id du user connecté au user id du nv mastering
            // => when we add a mastering for another user id, it will be automatically be assigned to the connected user id masterings 
            newMastering.UserId = getConnectedUserId();
            // Ajoute ce nouveau mastering au contexte EF
            _context.Masterings.Add(newMastering);
            // Sauve les changements
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            // find back the mastering from the DB to use the actual id
            // Renvoie une réponse ayant dans son body les données du nouveau mastering (3ème paramètre)
            // et ayant dans ses headers une entrée 'Location' qui contient l'url associé à GetOne avec la bonne valeur 
            // pour le paramètre 'id' de cet url.  
            // TODO: check the return after adding frontend - ask Sev
            return CreatedAtAction(nameof(GetOne), new { masteringID = newMastering.Id }, _mapper.Map<MasteringDTO>(newMastering));
        }


        // PUT /api/masterings
        [HttpPut]
        public async Task<IActionResult> PutMastering(MasteringDTO dto) {
            // Récupère en BD le mastering à mettre à jour
            var mastering = await _context.Masterings.FindAsync(dto.Id);
            // Si aucun mastering n'a été trouvé, renvoyer une erreur 404 Not Found
            if (mastering == null)
                return NotFound();  
            // Si le mastering appartient au user connecté
            if (isConnectedUser(mastering.UserId)) {
                // Attention: I had to comment "[Required]" for User and Skill in Mastering.cs
                dto.UserId = mastering.UserId;
                dto.SkillId = mastering.SkillId;
                // Mappe les données reçues sur celles du mastering en question
                _mapper.Map<MasteringDTO, Mastering>(dto, mastering);
                // Sauve les changements
                var res = await _context.SaveChangesAsyncWithValidation();
                if (!res.IsEmpty)
                    return BadRequest(res);
                // Retourne un statut 204 avec une réponse vide
                return NoContent();
            }
            return BadRequest("You are not entitled to adjust these data");  
        }


        // DELETE /api/masterings/{masteringID}
        [HttpDelete("{masteringID}")]
        public async Task<IActionResult> DeleteMastering(int masteringID) {
            // Récupère en BD le mastering à supprimer
            var mastering = await _context.Masterings.FindAsync(masteringID);
            // Si aucun mastering n'a été trouvé, renvoyer une erreur 404 Not Found
            if (mastering == null)
                return NotFound();
            // Si le mastering appartient au user connecté
            if (isConnectedUser(mastering.UserId)) {
                // Indique au contexte EF qu'il faut supprimer ce membre
                _context.Masterings.Remove(mastering);
                // Sauve les changements
                await _context.SaveChangesAsync();
                // Retourne un statut 204 avec une réponse vide
                return NoContent();
            } 
            return BadRequest("You are not entitled to remove these data");
        }

    }
}
