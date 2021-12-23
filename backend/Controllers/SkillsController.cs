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
    public class SkillsController : OurController
    {

        public SkillsController(CvContext context, IMapper mapper) : base(context, mapper) {
        } 

        // GET /api/skills
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SkillWithCategoryDTO>>> GetAll() {
            return _mapper.Map<List<SkillWithCategoryDTO>>(await _context.Skills.Include(s => s.Category).ToListAsync());
        }


        // GET /api/skills/{skillID}
        [HttpGet("{skillID}")]
        public async Task<ActionResult<SkillWithCategoryDTO>> GetOne(int skillID) {
            var skill = await _context.Skills
                                .Include(s => s.Category)
                                .SingleAsync(s => s.Id == skillID);
            return _mapper.Map<SkillWithCategoryDTO>(skill);          
        }


        // POST /api/skills
        [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpPost]
        public async Task<ActionResult<SkillDTO>> PostSkill(SkillDTO skill) {
            var newSkill = _mapper.Map<Skill>(skill);
            _context.Skills.Add(newSkill);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            // return CreatedAtAction(nameof(GetOne), new { skillID = newSkill.Id }, _mapper.Map<SkillDTO>(newSkill));
            // TODO ask confirmation
            return NoContent();
        }

        // PUT /api/skills/{skillID}
        [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpPut]
        public async Task<IActionResult> PutSkill(SkillDTO dto) {
            var skill = await _context.Skills.FindAsync(dto.Id);
            if (skill == null)
                return NotFound();
            if (dto.CategoryId == 0)
                dto.CategoryId = skill.CategoryId;
            skill.CategoryId = dto.CategoryId;
            _mapper.Map<SkillDTO, Skill>(dto, skill);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return NoContent();
        }


        // DELETE /api/skills/{skillID} 
        [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpDelete("{skillID}")]
        public async Task<IActionResult> DeleteSkill(int skillID) {
            var skill = await _context.Skills.FindAsync(skillID);
            if (skill == null)
                return NotFound();
            _context.Skills.Remove(skill);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
    
}
