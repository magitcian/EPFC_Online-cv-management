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

        // [HttpGet("cv/{userID}")]
        // public async Task<ActionResult<UserWithExperiencesWithMasteringsDTO>> GetCV(int userID) {
        //     var user = await _context.Users
        //                     .Include(u => u.Experiences)
        //                     .ThenInclude(exp => exp.Enterprise)
        //                     .Include(u => u.Experiences)
        //                     .ThenInclude(exp => ((Mission)exp).Client)
        //                     .SingleAsync(u => u.Id == userID);
        //     if (user == null)
        //         return NotFound();
        //     return _mapper.Map<UserWithExperiencesWithMasteringsDTO>(user);
        // }

        private int getConnectedUserId() {
            int connectedID = 0;
            if (Int32.TryParse(User.Identity.Name, out int ID)) {
                connectedID = ID;
            }
            return connectedID;
        }

        private User getConnectedUser() {
            return _context.Users.FirstOrDefault(u => u.Id == getConnectedUserId());
        }

        private bool isConnectedUser(int userID) {
            var connectedUser = getConnectedUser();
            var user = _context.Users.Find(userID);
            return user != null && user.Id == connectedUser.Id;
        }

        private bool isAdmin() {
            return User.IsInRole(Title.AdminSystem.ToString());
        }

        private bool isManager() {
            return User.IsInRole(Title.Manager.ToString());
        }

        [HttpGet("user_missions/{userID}")]
        public async Task<ActionResult<IEnumerable<MissionWithEnterprisesDTO>>> GetMissions(int userID) {
            if (isConnectedUser(userID) || isAdmin() || isManager()) {
                var missions = await _context.Missions
                                    .Where(m => m.UserId == userID)
                                    .OrderByDescending(m => m.Start) //inverse : OrderBy
                                    .Include(m => m.Client)
                                    .Include(m => m.Enterprise)
                                    .ToListAsync();
                return _mapper.Map<List<MissionWithEnterprisesDTO>>(missions);
            }
            return BadRequest("You are not entitled to obtain those data");
        }

        [HttpGet("user_masterings/{userID}")]
        public async Task<ActionResult<IEnumerable<MasteringWithSkillDTO>>> GetMasterings(int userID) { // MasteringWithSkillAndUserDTO
            if (isConnectedUser(userID) || isAdmin() || isManager()) {
                var masterings = await _context.Masterings
                                    .Where(m => m.UserId == userID)
                                    .Include(m => m.Skill)
                                    .ThenInclude(s => s.Category)
                                    .ToListAsync();
                return _mapper.Map<List<MasteringWithSkillDTO>>(masterings); // MasteringWithSkillAndUserDTO
            }
            return BadRequest("You are not entitled to obtain those data");
        }

        [HttpGet("user_categoriesWithDetails/{userID}")]
        public async Task<ActionResult<IEnumerable<CategoryWithSkillsAndMasteringsDTO>>> GetCategoriesWithDetails(int userID) {
            if (isConnectedUser(userID) || isAdmin() || isManager()) {
                var categories = await _context.Categories
                                    .Where(c => c.Skills.Any(s => s.MasteringSkillsLevels.Any(m => m.UserId == userID)))
                                    .Include(c => c.Skills.Where(s => s.MasteringSkillsLevels.Any(m => m.UserId == userID)))
                                    .ThenInclude(s => s.MasteringSkillsLevels.Where(m => m.UserId == userID))
                                    // .ThenInclude(m => m.User .Where(u => u.Id == userID))
                                    // .ThenInclude(m => m.User .Single(u => u.Id == userID)) 
                                    // .Where(c => c.Skills .Where(s => s.Mastering.UserId == userID))
                                    //.Where(u => u.Id == userID))
                                    //.Where(u => u.Id == userID))
                                    //.ThenInclude(s => s.MasteringSkillsLevels .Where(m => m.UserId == userID))
                                    //.ThenInclude(m => m.Level)
                                    // .Include(m => m.Skill)
                                    // .ThenInclude(s => s.Category)
                                    .ToListAsync();
                return _mapper.Map<List<CategoryWithSkillsAndMasteringsDTO>>(categories);

                // var skills = await _context.Categories
                //                     .Include(c => c.Skills)
                //                     .ThenInclude(s => s.MasteringSkillsLevels .Where(m => m.UserId == userID))
                //                     .ToListAsync();
                // return _mapper.Map<List<CategoryWithSkillsAndMasteringsDTO>>(skills);
            }
            return BadRequest("You are not entitled to obtain those data");
        }

        // GET /api/users
        [Authorized(Title.AdminSystem, Title.Manager)]
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
            // return _mapper.Map<List<UserDTO>>(await _context.Users.Include(m => m.Phones).ToListAsync());
            return _mapper.Map<List<UserDTO>>(await _context.Users.ToListAsync());
        }

        // GET /api/users/{userID}
        [Authorized(Title.AdminSystem)]
        [HttpGet("{userID}")]
        public async Task<ActionResult<UserDTO>> GetOne(int userID) {
            // Récupère en BD le membre dont l'id est passé en paramètre dans l'url
            var user = await _context.Users.FindAsync(userID);
            // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
            if (user == null)
                return NotFound();
            // Transforme le membre en son DTO et retourne ce dernier
            return _mapper.Map<UserDTO>(user);
        }

        // POST /api/users
        [AllowAnonymous] // no need to be authentified 
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
            // find back the user from the DB to use the actual id
            //var userDB = await _context.Users.SingleOrDefaultAsync(u => u.Email == newUser.Email);
            // Renvoie une réponse ayant dans son body les données du nouveau membre (3ème paramètre)
            // et ayant dans ses headers une entrée 'Location' qui contient l'url associé à GetOne avec la bonne valeur 
            // pour le paramètre 'email' de cet url.
            return CreatedAtAction(nameof(GetOne), new { userID = newUser.Id }, _mapper.Map<UserDTO>(newUser));
        }


        // // PUT /api/users
        // // [Authorized(Title.AdminSystem)]
        // [HttpPut]
        // public async Task<IActionResult> PutUser(UserWithPasswordDTO dto) {
        //     var connectedUser = getConnectedUser();
        //     // Récupère en BD le membre à mettre à jour
        //     var user = await _context.Users.FindAsync(dto.Id);
        //     var isAdmin = User.IsInRole(Title.AdminSystem.ToString()); // boolean
        //     // Protected method: changes only if admin or user to update is the connected user
        //     if (user != null && !isAdmin) {
        //         if (user.Id != connectedUser.Id)
        //             return BadRequest("You are not entitled to adjust these data");
        //     }
        //     // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
        //     if (user == null)
        //         return NotFound();
        //     // S'il n'y a pas de mot de passe dans le dto, on garde le mot de passe actuel
        //     if (string.IsNullOrEmpty(dto.Password))
        //         dto.Password = user.Password;
        //     // Mappe les données reçues sur celles du membre en question
        //     _mapper.Map<UserWithPasswordDTO, User>(dto, user);
        //     // Sauve les changements
        //     var res = await _context.SaveChangesAsyncWithValidation();
        //     if (!res.IsEmpty)
        //         return BadRequest(res);
        //     // Retourne un statut 204 avec une réponse vide
        //     return NoContent();
        // }


        // DELETE /api/users/{userID} 
        [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpDelete("{userID}")]
        public async Task<IActionResult> DeleteUser(int userID) {
            // Récupère en BD le membre à supprimer
            var user = await _context.Users.FindAsync(userID);
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

            // return null if user not found
            if (user == null)
                return null;

            if (user.Password == password) {
                // authentication successful so generate jwt token
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes("my-super-secret-key");
                var tokenDescriptor = new SecurityTokenDescriptor {
                    Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Title.ToString())
                }),
                    IssuedAt = DateTime.UtcNow,
                    Expires = DateTime.UtcNow.AddMinutes(120), // TODO: to update at the end
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
            return await _context.Users.SingleOrDefaultAsync(u => u.Email == email) == null;
        }

        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<ActionResult<UserDTO>> SignUp(UserWithPasswordDTO data) {
            data.Title = Title.Consultant;
            return await PostUser(data);
        }

        [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpGet("my-consultant")]
        public async Task<ActionResult<IEnumerable<ConsultantDTO>>> GetMyConsultants() {
            var consultants = await _context.Consultants
                                .Where(c => c.ManagerId == getConnectedUserId())
                                .ToListAsync();
            return _mapper.Map<List<ConsultantDTO>>(consultants);
        }

        [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpGet("consultant-without-manager")]
        public async Task<ActionResult<IEnumerable<ConsultantDTO>>> GetConsultantsWithoutManager() {
            var consultants = await _context.Consultants
                                .Where(c => c.ManagerId == null)
                                .ToListAsync();
            return _mapper.Map<List<ConsultantDTO>>(consultants);
        }

        [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpGet("add-link-with-consultant/{consultantID}")]
        public async Task<IActionResult> AddLinkWithConsultant(int consultantID) {
            var consultant = await _context.Consultants.FindAsync(consultantID);
            if (consultant == null)
                return NotFound();
            if (consultant.ManagerId == null) {
                consultant.ManagerId = getConnectedUserId();
            } else {
                 return BadRequest(new ValidationErrors().Add("You are not allowed to change this link!", "Add link"));
            }
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return NoContent();
        }

        [Authorized(Title.AdminSystem, Title.Manager)]
        [HttpGet("remove-link-with-consultant/{consultantID}")]
        public async Task<IActionResult> RemoveLinkWithConsultant(int consultantID) {
            var consultant = await _context.Consultants.FindAsync(consultantID);
            if (consultant == null)
                return NotFound();
            if (consultant.ManagerId == getConnectedUserId()) {
                consultant.ManagerId = null;
            } else {
                 return BadRequest(new ValidationErrors().Add("You are not allowed to change this link!", "Remove link"));
            }
            var res = await _context.SaveChangesAsyncWithValidation();
            if (!res.IsEmpty)
                return BadRequest(res);
            return NoContent();
        }


    }
}
