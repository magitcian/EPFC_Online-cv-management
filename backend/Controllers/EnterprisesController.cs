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
    [Authorize] // to protect the controller
    [Route("api/[controller]")]
    [ApiController]
    public class EnterprisesController : ControllerBase
    {
        private readonly CvContext _context;
        private readonly IMapper _mapper;

        /*
        Le contrôleur est instancié automatiquement par ASP.NET Core quand une requête HTTP est reçue.
        Les deux paramètres du constructeur recoivent automatiquement, par injection de dépendance, 
        une instance du context EF (MsnContext) et une instance de l'auto-mapper (IMapper).
        */
        public EnterprisesController(CvContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }


    }
}
