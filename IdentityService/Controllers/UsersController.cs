using IdentityService.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SharedLibrary.Models;
using IdentityService.Models.Dtos;

namespace IdentityService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IMongoCollection<User> _users;

        public UsersController(MongoDbContext context)
        {
            _users = context.GetCollection<User>("Users");
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _users.Find(_ => true)
                    .Project(u => new UserResponseDto 
                    {
                        Username = u.Username,
                        RoleName = u.RoleName,
                        IsActive = u.IsActive,
                        CreatedAt = u.CreatedAt
                    })
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving users", error = ex.Message });
            }
        }


        [HttpDelete("{username}")]
        public async Task<IActionResult> DeleteUser(string username)
        {
            if (string.IsNullOrEmpty(username))
                return BadRequest(new { message = "Username is required." });

            try
            {
                var result = await _users.DeleteOneAsync(u => u.Username == username);

                if (result.DeletedCount == 0)
                {
                    return NotFound(new { message = $"User '{username}' not found." });
                }

                return Ok(new { message = $"User '{username}' has been deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the user.", error = ex.Message });
            }
        }

        [HttpPut("{username}/role")]
        public async Task<IActionResult> UpdateUserRole(string username, [FromBody] RoleUpdateDto request)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(request.RoleName))
                return BadRequest(new { message = "Username and Role Name are required." });

            try
            {
                var filter = Builders<User>.Filter.Eq(u => u.Username, username);
                var update = Builders<User>.Update.Set(u => u.RoleName, request.RoleName);

                var result = await _users.UpdateOneAsync(filter, update);

                if (result.MatchedCount == 0)
                    return NotFound(new { message = $"User '{username}' not found." });

                return Ok(new { message = $"User '{username}' updated to '{request.RoleName}'." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating role", error = ex.Message });
            }
        }

        [HttpPut("{username}/status")]
        public async Task<IActionResult> UpdateUserStatus(string username, [FromBody] StatusUpdateDto request)
        {
            if (string.IsNullOrEmpty(username))
                return BadRequest(new { message = "Username is required." });

            try
            {
                var filter = Builders<User>.Filter.Eq(u => u.Username, username);
                var update = Builders<User>.Update.Set(u => u.IsActive, request.IsActive);

                var result = await _users.UpdateOneAsync(filter, update);

                if (result.MatchedCount == 0)
                    return NotFound(new { message = $"User '{username}' not found." });

                string status = request.IsActive ? "activated" : "deactivated";
                return Ok(new { message = $"User '{username}' has been {status} successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating user status", error = ex.Message });
            }
        }
    }
}
