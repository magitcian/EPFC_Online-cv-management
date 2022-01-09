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
    public class ExperiencesController : OurController
    {
        private readonly CvContext _context;
        private readonly IMapper _mapper;

        public ExperiencesController(CvContext context, IMapper mapper) : base(context, mapper) {
            _context = context;
            _mapper = mapper;
        }

        // public ExperiencesController(CvContext context, IMapper mapper) : base(context, mapper) {
        // }

        [Authorized(Title.AdminSystem)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExperienceDTO>>> GetAll() {
            //return _mapper.Map<List<ExperienceDTO>>(await _context.Experiences.ToListAsync()); 
            return _mapper.Map<List<ExperienceDTO>>(await _context.Experiences.Include(exp => exp.Enterprise).ToListAsync());
        }

        // GET /api/experiences/{experienceID}
        [HttpGet("{experienceID}")]
        public async Task<ActionResult<ExperienceDTO>> GetOne(int experienceID) {
            var experience = await _context.Experiences.FindAsync(experienceID);
            if (experience == null)
                return NotFound();
            if (isConnectedUserExperience(experienceID) || isAdmin()) {
                return _mapper.Map<ExperienceDTO>(experience);
            } else {
                return BadRequest("You are not entitled to obtain those data");
            }
        }


        [HttpGet("experience_categoriesWithUsings/{experienceID}")]
        public async Task<ActionResult<IEnumerable<CategoryWithSkillsAndUsingsDTO>>> GetCategoriesWithUsings(int experienceID) {
            if (isConnectedUserExperience(experienceID) || isAdmin()) {
                var categories = await _context.Categories
                                    .Where(c => c.Skills.Any(s => s.Usings.Any(u => u.ExperienceId == experienceID)))
                                    .Include(c => c.Skills.Where(s => s.Usings.Any(u => u.ExperienceId == experienceID)))
                                    .ThenInclude(s => s.Usings.Where(u => u.ExperienceId == experienceID))
                                    .ToListAsync();
                return _mapper.Map<List<CategoryWithSkillsAndUsingsDTO>>(categories);
            }
            return BadRequest("You are not entitled to obtain those data");
        }

        private bool isConnectedUserExperience(int experienceID) {
            var experience = _context.Experiences.Find(experienceID);
            return getConnectedUserId() == experience.UserId || isManagerOfConsultant(experience.UserId);
        }   

    }
}
