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
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MissionsController : ControllerBase
    {
        private readonly CvContext _context;
        private readonly IMapper _mapper;

        public MissionsController(CvContext context, IMapper mapper) {
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


        [HttpDelete("{missionID}")]
        public async Task<IActionResult> DeleteMission(int missionID) {
            var mission = await _context.Missions.FindAsync(missionID);
            if (mission == null)
                return NotFound();
            if (isConnectedUserOrAdmin(mission.UserId).Result) {
                _context.Missions.Remove(mission);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            return BadRequest("You are not entitled to remove those data");
        }


        [HttpPut]
        public async Task<IActionResult> PutMission(MissionWithUserDTO dto) {
            var mission = await _context.Missions.FindAsync(dto.Id);
            if (mission == null)
                return NotFound();
            if (isConnectedUser(mission.UserId).Result) {
                if (string.IsNullOrEmpty(dto.Enterprise?.Id.ToString())) {
                    dto.Enterprise = new EnterpriseDTO();
                    dto.Enterprise.Id = new int();
                    dto.Enterprise.Id = mission.EnterpriseId;
                }
                if (string.IsNullOrEmpty(dto.User?.Id.ToString())) {
                    dto.User = new UserDTO();
                    _mapper.Map<User, UserDTO>(mission.User, dto.User);
                }
                _mapper.Map<MissionDTO, Mission>(dto, mission);
                //mission.User = getConnectedUser().Result;
                mission.Enterprise = await _context.Enterprises.FindAsync(dto.Enterprise.Id); //Pour éviter de modifier le nom de l'entreprise
                if (mission.ClientId == 0) {
                    mission.ClientId = null;
                }else if(dto.Client != null){
                    mission.Client = await _context.Enterprises.FindAsync(dto.Client.Id);
                }
                await _context.SaveChangesAsync();
                return NoContent();
            }
            return BadRequest("You are not entitled to adjust these data");
        }

        [HttpPost]
        public async Task<ActionResult<MissionDTO>> PostMission(MissionDTO dto) {
            var newMission = _mapper.Map<Mission>(dto);
            newMission.User = getConnectedUser().Result;
           // Enterprise enterprise = await _context.Enterprises.FindAsync(dto.Enterprise.Id);
            _context.Missions.AddRange(newMission);
            newMission.Enterprise = null;
            newMission.EnterpriseId = 1;
            //TODO question : fonctionne pas...
            //newMission.EnterpriseId = dto.Enterprise.Id;
            // newMission.Enterprise = await _context.Enterprises.FindAsync(dto.Enterprise.Id);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
