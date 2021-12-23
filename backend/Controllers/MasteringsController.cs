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
    public class MasteringsController : OurController
    {

        public MasteringsController(CvContext context, IMapper mapper) : base(context, mapper) {
        }

        // GET /api/masterings  
        [Authorized(Title.AdminSystem)] // TODO: check if authorized for managers [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MasteringDTO>>> GetAll() {   
            return _mapper.Map<List<MasteringDTO>>(await _context.Masterings.ToListAsync());
        }


        // GET /api/masterings/{masteringID}
        [HttpGet("{masteringID}")]
        public async Task<ActionResult<MasteringDTO>> GetOne(int masteringID) {
            var mastering = await _context.Masterings.FindAsync(masteringID);
            if (mastering == null)
                return NotFound();
            if (isConnectedUser(mastering.UserId) || isConsultantsManagerMastering(mastering) || isAdmin())    
                return _mapper.Map<MasteringDTO>(mastering);
            return BadRequest("You are not entitled to get these data");     
        }

        // Manager is entitled to get a mastering of his/her consultants or consultants with no manager
        private bool isConsultantsManagerMastering(Mastering mastering) {
            if (isManager()) {
                var manager = (Manager) getConnectedUser();
                var consultant = _context.Consultants.Find(mastering.UserId);
                return (consultant != null && (consultant.ManagerId == null || consultant.ManagerId == manager.Id));  
            }
            return false;
        }

        // private bool isConsultantsManagerMasteringOld(Mastering mastering) {
        //     if (isManager()) {
        //         var manager = (Manager) getConnectedUser();
        //         var consultantsOfTheManager = manager.Consultants;
        //         foreach (var consultant in consultantsOfTheManager) {
        //             if (consultant.Id == mastering.UserId)
        //                 return true;
        //         }
        //     }
        //     return false;
        // }

        // POST /api/masterings
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
            // return CreatedAtAction(nameof(GetOne), new { masteringID = newMastering.Id }, _mapper.Map<MasteringDTO>(newMastering));
            // TODO ask confirmation
            return NoContent();
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
                dto.SkillId = mastering.SkillId; // skillId can't be changed
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
            // Si le user connecté est le "propriétaire" du mastering (si le mastering appartient au user connecté)
            if (isConnectedUser(mastering.UserId)) {
                // Indique au contexte EF qu'il faut supprimer ce mastering
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
