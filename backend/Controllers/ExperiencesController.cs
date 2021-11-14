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
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ExperiencesController : ControllerBase
    {
        private readonly CvContext _context;
        private readonly IMapper _mapper;

        public ExperiencesController(CvContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }

        //[Authorized(Role.Admin)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExperienceDTO>>> GetAll() {
            //return _mapper.Map<List<ExperienceDTO>>(await _context.Experiences.ToListAsync()); 
            return _mapper.Map<List<ExperienceDTO>>(await _context.Experiences.Include(exp => exp.Enterprise).ToListAsync());
        }

    }
}
