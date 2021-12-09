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


        // PUT /api/users
        // [Authorized(Title.AdminSystem)]
        [HttpPut]
        public async Task<IActionResult> PutMission(MissionDTO dto) {
            var mission = await _context.Missions.FindAsync(dto.Id);
            if (mission == null)
                return NotFound();
            if (isConnectedUser(mission.UserId).Result) {
                _mapper.Map<MissionDTO, Mission>(dto, mission);
                //ajouter le user relié à la mission
                mission.User = getConnectedUser().Result;
                //TODO severine : à changer:
                mission.ClientId = 1;
                mission.EnterpriseId = 1;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            return BadRequest("You are not entitled to adjust these data");
        }

    }
}
