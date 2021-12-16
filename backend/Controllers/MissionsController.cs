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

        private int getConnectedUserId() {
            int connectedID = 0;
            if (Int32.TryParse(User.Identity.Name, out int ID)) {
                connectedID = ID;
            }
            return connectedID;
        }

        private User getConnectedUser() {
            int connectedID = 0;
            if (Int32.TryParse(User.Identity.Name, out int ID)) {
                connectedID = ID;
            }
            return _context.Users.FirstOrDefault(u => u.Id == connectedID);
        }

        private bool isConnectedUserOrAdmin(int userID) {
            var connectedUser = getConnectedUser();
            var user = _context.Users.Find(userID);
            var isAdmin = User.IsInRole(Title.AdminSystem.ToString());
            return isAdmin || (user != null && user.Id == connectedUser.Id);
        }

        private bool isConnectedUser(int userID) {
            var connectedUser = getConnectedUser();
            var user = _context.Users.Find(userID);
            return user != null && user.Id == connectedUser.Id;
        }


        [HttpDelete("{missionID}")]
        public async Task<IActionResult> DeleteMission(int missionID) {
            var mission = await _context.Missions.FindAsync(missionID);
            if (mission == null)
                return NotFound();
            if (isConnectedUserOrAdmin(mission.UserId)) {
                _context.Missions.Remove(mission);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            return BadRequest("You are not entitled to remove those data");
        }

        [HttpPut]
        public async Task<IActionResult> PutMission(MissionDTO dto) {
            var mission = await _context.Missions.FindAsync(dto.Id);
            if (mission == null)
                return NotFound();
            if (isConnectedUser(mission.UserId)) {
                dto.UserId = mission.UserId;
                _mapper.Map<MissionDTO, Mission>(dto, mission);
                var res = await _context.SaveChangesAsyncWithValidation();
                if (!res.IsEmpty)
                    return BadRequest(res);
                return NoContent();
            }
            return BadRequest("You are not entitled to adjust these data");
        }

        [HttpPost]
        public async Task<IActionResult> PostMission(MissionDTO dto) {
            var newMission = _mapper.Map<Mission>(dto);
            newMission.UserId = getConnectedUserId();
            if (newMission.ClientId == 0) {
                newMission.ClientId = null;
            }
            // if (newMission.Title == null || newMission.Title == "")
            //     return BadRequest(new ValidationErrors().Add("Title must be completed", "Title"));
            _context.Missions.AddRange(newMission);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return NoContent();
        }

    }
}
