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
    public class UsersController : ControllerBase
    {
        private readonly CvContext _context;
        private readonly IMapper _mapper;

        public UsersController(CvContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }

        //[Authorized(Role.Admin)]
        [HttpGet("cv/{userID}")]
        public async Task<ActionResult<UserWithExperiencesDTO>> GetCV(int userID) {
            // User user = null;
            // if (Int32.TryParse(userID, out int id)) {
            //     user = await _context.Users
            //                     .Include(u => u.Experiences)
            //                     .ThenInclude(exp => exp.Enterprise)
            //                     .SingleAsync(u => u.Id == id);
            // }
            var user = await _context.Users
                            .Include(u => u.Experiences)
                            .ThenInclude(exp => exp.Enterprise)
                            .SingleAsync(u => u.Id == userID);
            if (user == null)
                return NotFound();
            return _mapper.Map<UserWithExperiencesDTO>(user);
        }

    }
}
