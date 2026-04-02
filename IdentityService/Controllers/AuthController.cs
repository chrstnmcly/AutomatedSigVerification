using IdentityService.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;
using SharedLibrary.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace IdentityService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<Role> _roles; 
        private readonly IConfiguration _config;

        public AuthController(MongoDbContext context, IConfiguration config)
        {
            _users = context.GetCollection<User>("Users");
            _roles = context.GetCollection<Role>("Roles"); 
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (user == null || string.IsNullOrEmpty(user.RoleName))
                return BadRequest(new { message = "User data and Role are required." });

            var rolesCollection = _roles.Database.GetCollection<BsonDocument>("Roles");
            var configDoc = await rolesCollection.Find(new BsonDocument()).FirstOrDefaultAsync();

            if (configDoc == null)
                return StatusCode(500, new { message = "RBAC configuration not found in database." });

            var rbacConfig = configDoc["rbac_configuration"].AsBsonDocument;
            var rolesArray = rbacConfig["roles"].AsBsonArray;

            bool isValidRole = rolesArray.Any(r =>
                r.AsBsonDocument["role"].AsString.Equals(user.RoleName, StringComparison.OrdinalIgnoreCase)
            );

            if (!isValidRole)
                return BadRequest(new { message = $"The role '{user.RoleName}' is not a valid system role." });

            var existingUser = await _users.Find(u => u.Username == user.Username).FirstOrDefaultAsync();
            if (existingUser != null)
                return BadRequest(new { message = "Username already exists" });

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
            user.CreatedAt = DateTime.UtcNow;

            await _users.InsertOneAsync(user);

            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginRequest)
        {
            var user = await _users.Find(u => u.Username == loginRequest.Username).FirstOrDefaultAsync();

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.PasswordHash, user.PasswordHash))
                return Unauthorized(new { message = "Invalid username or password" });

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config["JwtSettings:Secret"]!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.RoleName)
            }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _config["JwtSettings:Issuer"],
                Audience = _config["JwtSettings:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                role = user.RoleName,
                username = user.Username,
                isActive = user.IsActive
            });
        }
    }
}
