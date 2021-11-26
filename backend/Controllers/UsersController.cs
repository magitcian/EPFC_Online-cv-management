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
    // [Authorize] // to protect the controller
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly CvContext _context;
        private readonly IMapper _mapper;

        /*
        Le contrôleur est instancié automatiquement par ASP.NET Core quand une requête HTTP est reçue.
        Les deux paramètres du constructeur recoivent automatiquement, par injection de dépendance, 
        une instance du context EF (MsnContext) et une instance de l'auto-mapper (IMapper).
        */

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



        // GET /api/users
        [Authorized(Title.AdminSystem)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll() {
            /*
            Remarque: La ligne suivante ne marche pas :
                return _mapper.Map<IEnumerable<UserDTO>>(await _context.Users.ToListAsync());
            En effet :
                C# doesn't support implicit cast operators on interfaces. Consequently, conversion of the interface to a concrete type is necessary to use ActionResult<T>.
                See: https://docs.microsoft.com/en-us/aspnet/core/web-api/action-return-types?view=aspnetcore-5.0#actionresultt-type
            */

            // Récupère une liste de tous les membres et utilise le mapper pour les transformer en leur DTO
            // return _mapper.Map<List<UserDTO>>(await _context.Users.ToListAsync()); // before link between Users and phones
            // return _mapper.Map<List<UserDTO>>(await _context.Users.Include(m => m.Phones).ToListAsync());
            return _mapper.Map<List<UserDTO>>(await _context.Users.ToListAsync());
        }


        // GET /api/users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetOne(int id) { // TODO: replace email by id => GetOne(int id)
            // Récupère en BD le membre dont le email est passé en paramètre dans l'url
            // var user = await _context.Users.FindAsync(email); // before link between Users and phones
            // var user = await _context.Users.Include(m => m.Phones).SingleAsync(m => m.Email == email);
            var user = await _context.Users.FindAsync(id); 
            //var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
            // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
            if (user == null)
                return NotFound();
            // Transforme le membre en son DTO et retourne ce dernier
            return _mapper.Map<UserDTO>(user);
        }


        // POST /api/users
        [HttpPost]
        public async Task<ActionResult<UserDTO>> PostUser(UserWithPasswordDTO user) {
            // Utilise le mapper pour convertir le DTO qu'on a reçu en une instance de User
            var newUser = _mapper.Map<Consultant>(user);
            // Ajoute ce nouveau membre au contexte EF
            _context.Users.Add(newUser);
            // Sauve les changements
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);

            // Renvoie une réponse ayant dans son body les données du nouveau membre (3ème paramètre)
            // et ayant dans ses headers une entrée 'Location' qui contient l'url associé à GetOne avec la bonne valeur 
            // pour le paramètre 'email' de cet url.
            return CreatedAtAction(nameof(GetOne), new { email = user.Email }, _mapper.Map<UserDTO>(newUser));
        }


        // PUT /api/users/{email}
        // [Authorized(Title.AdminSystem)]
        [Authorize]
        [HttpPut]
        public async Task<IActionResult> PutUser(UserWithPasswordDTO dto) {
            var connectedEmail = User.Identity.Name;
            var connectedUser = _context.Users.SingleOrDefault(u => u.Email == connectedEmail);
            // Récupère en BD le membre à mettre à jour
            // var User = await _context.Users.FindAsync(dto.Email); // before link between Users and phones
            // var User = await _context.Users.Include(m => m.Phones).SingleAsync(m => m.Email == dto.Email);
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);

            //var isAdmin = User.IsInRole(Title.AdminSystem.ToString()); // boolean

            // Protected method: changes only if admin or user to update is the connected user
            if (user != null && !User.IsInRole(Title.AdminSystem.ToString())) {
                if (user.Id != connectedUser.Id)
                    return BadRequest("You are not entitled to adjust these data");    
            }   
            
            // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
            if (user == null)
                return NotFound();
            // S'il n'y a pas de mot de passe dans le dto, on garde le mot de passe actuel
            if (string.IsNullOrEmpty(dto.Password))
                dto.Password = user.Password;
            // Mappe les données reçues sur celles du membre en question
            // _mapper.Map<UserDTO, User>(dto, User); // before link between Users and phones
            _mapper.Map<UserWithPasswordDTO, User>(dto, user);
            // Sauve les changements
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            // Retourne un statut 204 avec une réponse vide
            return NoContent();
            
        }



        // DELETE /api/users/{email} => check if on url
        [Authorized(Title.AdminSystem)]
        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteUser(string email) { // TODO: replace email with id
            // Récupère en BD le membre à supprimer
            // var user = await _context.Users.FindAsync(email);
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
            // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
            if (user == null)
                return NotFound();
            // Indique au contexte EF qu'il faut supprimer ce membre
            _context.Users.Remove(user);
            // Sauve les changements
            await _context.SaveChangesAsync();
            // Retourne un statut 204 avec une réponse vide
            return NoContent();
        }

        [AllowAnonymous] // to unprotect this method (the only one in the controller)
        [HttpPost("authenticate")]
        public async Task<ActionResult<UserDTO>> Authenticate(UserWithPasswordDTO dto) {
            var user = await Authenticate(dto.Email, dto.Password);

            if (user == null)
                return BadRequest(new ValidationErrors().Add("User not found", "Email"));
            if (user.Token == null)
                return BadRequest(new ValidationErrors().Add("Incorrect password", "Password"));

            return Ok(_mapper.Map<UserDTO>(user));
        }

        private async Task<User> Authenticate(string email, string password) {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);

            // return null if User not found
            if (user == null)
                return null;

            if (user.Password == password) {
                // authentication successful so generate jwt token
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes("my-super-secret-key");
                var tokenDescriptor = new SecurityTokenDescriptor {
                    Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Name, user.Email),
                    new Claim(ClaimTypes.Role, user.Title.ToString()) // TODO to check
                }),
                    IssuedAt = DateTime.UtcNow,
                    Expires = DateTime.UtcNow.AddMinutes(10),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                user.Token = tokenHandler.WriteToken(token);
            }

            return user;
        }

        [AllowAnonymous]
        [HttpGet("available/{email}")]
        public async Task<ActionResult<bool>> IsAvailable(string email) {
            // return await _context.Users.FindAsync(email) == null;
            return await _context.Users.SingleOrDefaultAsync(u => u.Email == email) == null;
        }

        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<ActionResult<UserDTO>> SignUp(UserWithPasswordDTO data) {
            data.Title = Title.JuniorConsultant;
            return await PostUser(data);
        }

    }
}
