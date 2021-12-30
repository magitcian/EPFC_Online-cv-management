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
    public class TrainingsController : OurController
    {

        public TrainingsController(CvContext context, IMapper mapper) : base(context, mapper) {
        } 

        // GET /api/trainings
        [HttpGet]
        [Authorized(Title.AdminSystem)] // TODO: check if authorized for managers [Authorized(Title.AdminSystem, Title.Manager)]
        public async Task<ActionResult<IEnumerable<TrainingDTO>>> GetAll() {
            return _mapper.Map<List<TrainingDTO>>(await _context.Trainings.ToListAsync());
        }


        // GET /api/trainings/{trainingID}
        [HttpGet("{trainingID}")]
        public async Task<ActionResult<TrainingWithEnterprisesAndUsingsDTO>> GetOne(int trainingID) {
            // var training = await _context.Trainings.FindAsync(trainingID);
            var training = await _context.Trainings
                                    .Include(t => t.Enterprise)
                                    .Include(t => t.Usings)
                                    .ThenInclude(u => u.Skill)
                                    .SingleOrDefaultAsync(t => t.Id == trainingID);
            if (training == null)
                return NotFound();
            if (isConnectedUser(training.UserId) || isConsultantsManagerTraining(training) || isAdmin())    
                return _mapper.Map<TrainingWithEnterprisesAndUsingsDTO>(training);
            return BadRequest("You are not entitled to get these data");           
        }

        // Manager is entitled to get a training of his/her consultants or consultants with no manager
        private bool isConsultantsManagerTraining(Training training) {
            if (isManager()) {
                var manager = (Manager) getConnectedUser();
                var consultant = _context.Consultants.Find(training.UserId);
                return (consultant != null && (consultant.ManagerId == null || consultant.ManagerId == manager.Id));  
            }
            return false;
        }


        // POST /api/trainings
        [HttpPost]
        public async Task<ActionResult<TrainingWithUsingsDTO>> PostTraining(TrainingWithUsingsDTO training) {
            var newTraining = _mapper.Map<Training>(training);
            newTraining.UserId = getConnectedUserId();
            // TODO check add a training with usings !
            _context.Trainings.Add(newTraining);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return NoContent();
        }

        // PUT /api/trainings/{trainingID}
        [HttpPut]
        public async Task<IActionResult> PutTraining(TrainingWithUsingsDTO dto) {
            var training = await _context.Trainings
                                    .Include(t => t.Usings)
                                    .SingleOrDefaultAsync(t => t.Id == dto.Id);
            if (training == null)
                return NotFound();
            if (isConnectedUser(training.UserId)) {
                dto.UserId = training.UserId;
                _mapper.Map<TrainingWithUsingsDTO, Training>(dto, training);
                var res = await _context.SaveChangesAsyncWithValidation();
                if (!res.IsEmpty)
                    return BadRequest(res);
                return NoContent();
            } 
            return BadRequest("You are not entitled to adjust these data");
            // TODO check edit a training with usings !
        }


        // DELETE /api/trainings/{trainingID} 
        [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpDelete("{trainingID}")]
        public async Task<IActionResult> DeleteTraining(int trainingID) {
            var training = await _context.Trainings.FindAsync(trainingID);
            if (training == null)
                return NotFound();
            if (isConnectedUser(training.UserId)) {    
                _context.Trainings.Remove(training);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            return BadRequest("You are not entitled to remove these data");
        }

    }
    
}
