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
    public class MissionsController : OurController
    {

        private readonly CvContext _context;
        private readonly IMapper _mapper;

        public MissionsController(CvContext context, IMapper mapper) : base(context, mapper) {
            _context = context;
            _mapper = mapper;
        }

        [HttpDelete("{missionID}")]
        public async Task<IActionResult> DeleteMission(int missionID) {
            var mission = await _context.Missions.FindAsync(missionID);
            if (mission == null)
                return NotFound();
            if (isConnectedUser(mission.UserId)) {
                _context.Missions.Remove(mission);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            return BadRequest("You are not entitled to remove those data");
        }

        [HttpPut]
        public async Task<IActionResult> PutMission(MissionWithUsingsDTO dto) {
            //var mission = await _context.Missions.FindAsync(dto.Id); 
            var mission = await _context.Missions
                    .Include(m => m.Usings)
                    .FirstAsync(m => m.Id == dto.Id);
            if (mission == null)
                return NotFound();
            if (isConnectedUser(mission.UserId)) {
                dto.UserId = mission.UserId;
                _mapper.Map<MissionDTO, Mission>(dto, mission);
                if (mission.ClientId == 0) {
                    mission.ClientId = null;
                }
                var res = await _context.SaveChangesAsyncWithValidation();

                if (!res.IsEmpty)
                    return BadRequest(res);
                return NoContent();
            }
            return BadRequest("You are not entitled to adjust these data");
        }

        [HttpPost]
        public async Task<IActionResult> PostMission(MissionWithUsingsDTO dto) {
            var newMission = _mapper.Map<Mission>(dto);
            newMission.UserId = getConnectedUserId();
            if (newMission.ClientId == 0) {
                newMission.ClientId = null;
            }
            _context.Missions.Add(newMission);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return NoContent();
        }

    }
}
