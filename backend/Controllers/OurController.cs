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
    [Authorize] // indique qu'il faut être authentifié, mais accepte tous les rôles
    [Route("api/[controller]")]
    [ApiController]
    public class OurController : ControllerBase
    {
        private readonly CvContext _context;
        private readonly IMapper _mapper;

        /*
        Le contrôleur est instancié automatiquement par ASP.NET Core quand une requête HTTP est reçue.
        Les deux paramètres du constructeur recoivent automatiquement, par injection de dépendance, 
        une instance du context EF (CvContext) et une instance de l'auto-mapper (IMapper).
        */

        protected OurController(CvContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }

        protected int getConnectedUserId() {
            int connectedID = 0;
            if (Int32.TryParse(User.Identity.Name, out int ID)) {
                connectedID = ID;
            }
            return connectedID;
        }

        protected User getConnectedUser() {
            return _context.Users.FirstOrDefault(u => u.Id == getConnectedUserId());
        }

        protected bool isConnectedUser(int userID) {
            var connectedUser = getConnectedUser();
            var user = _context.Users.Find(userID);
            return user != null && user.Id == connectedUser.Id;
        }

        protected bool isAdmin() {
            return User.IsInRole(Title.AdminSystem.ToString());
        }

        protected bool isManager() {
            return User.IsInRole(Title.Manager.ToString());
        }

        protected bool isManagerOfConsultant(int consultantID) {
            if(isManager()){
                var consultant = _context.Consultants.Find(consultantID);
                return (consultant != null && (consultant.ManagerId == null || consultant.ManagerId == getConnectedUserId()));
            }
            return false;
        }

    }

}        