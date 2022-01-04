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
    public class EnterprisesController : OurController
    {
        public EnterprisesController(CvContext context, IMapper mapper) : base(context, mapper) {
        }

        // GET /api/enterprises
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EnterpriseDTO>>> GetAll() {
            return _mapper.Map<List<EnterpriseDTO>>(await _context.Enterprises.ToListAsync());
        }

        // GET /api/enterprises/{enterpriseID}
        [HttpGet("{enterpriseID}")]
        public async Task<ActionResult<EnterpriseDTO>> GetOne(int enterpriseID) {
            var enterprise = await _context.Enterprises.FindAsync(enterpriseID);
            // var enterprise = await _context.Enterprises.SingleAsync(e => e.Id == enterpriseID);
            return _mapper.Map<EnterpriseDTO>(enterprise);          
        }

        // POST /api/enterprises
        [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpPost]
        public async Task<ActionResult<EnterpriseDTO>> PostEnterprise(EnterpriseDTO enterprise) {
            var newEnterprise = _mapper.Map<Enterprise>(enterprise);
            _context.Enterprises.Add(newEnterprise);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            // return CreatedAtAction(nameof(GetOne), new { enterpriseID = newEnterprise.Id }, _mapper.Map<EnterpriseDTO>(newEnterprise));
            // TODO ask confirmation
            return NoContent();
        }

        // PUT /api/enterprises/{enterpriseID}
        [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpPut]
        public async Task<IActionResult> PutEnterprise(EnterpriseDTO dto) {
            var enterprise = await _context.Enterprises.FindAsync(dto.Id);
            if (enterprise == null)
                return NotFound();
            _mapper.Map<EnterpriseDTO, Enterprise>(dto, enterprise);
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return NoContent();
        }


        // DELETE /api/enterprises/{enterpriseID} 
        [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpDelete("{enterpriseID}")]
        public async Task<IActionResult> DeleteEnterprise(int enterpriseID) {
            var enterprise = await _context.Enterprises.FindAsync(enterpriseID);
            if (enterprise == null)
                return NotFound();
            _context.Enterprises.Remove(enterprise);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET /api/enterprises/name-available/{name} 
        [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpGet("name-available/{name}")]
        public async Task<ActionResult<bool>> IsNameAvailable(string name) {
            return await _context.Enterprises.SingleOrDefaultAsync(e => e.Name == name) == null;
        }

    }
}
