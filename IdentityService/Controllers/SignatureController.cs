using IdentityService.Data;
using IdentityService.Models.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Driver.GridFS; 
using SharedLibrary.Models;

namespace IdentityService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SignatureController : ControllerBase
    {
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<AccountHolder> _accountsCollection;
        private readonly IGridFSBucket _gridFs;

        public SignatureController(MongoDbContext context)
        {
            _users = context.GetCollection<User>("Users");
            _accountsCollection = context.GetCollection<AccountHolder>("AccountHolders");
            _gridFs = new GridFSBucket(context.Database);
        }

        [HttpGet("getAllAccounts")]
        public async Task<IActionResult> GetAllAccounts()
        {
            try
            {
                var accounts = await _accountsCollection.Find(_ => true).ToListAsync();

                var response = accounts.Select(a => new {
                    a.Id,
                    a.FullName,
                    a.AccountNumber,
                    a.CreatedAt
                });

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching account holders.",
                    error = ex.Message
                });
            }
        }


        [HttpPost("{username}/signatures")]
        public async Task<IActionResult> UploadSignatures(string username, [FromBody] List<string> base64Signatures)
        {
            if (base64Signatures == null || base64Signatures.Count != 3)
                return BadRequest(new { message = "Exactly 3 signatures are required." });

            try
            {
                var userExists = await _users.Find(u => u.Username == username).AnyAsync();
                if (!userExists)
                    return NotFound(new { message = $"User '{username}' not found." });

                var signatureIds = new List<string>();

                foreach (var b64 in base64Signatures)
                {
                    string cleanB64 = b64.Contains(",") ? b64.Split(',')[1] : b64;

                    byte[] imageBytes = Convert.FromBase64String(cleanB64);

                    var fileName = $"{username}_ref_{Guid.NewGuid()}.png";
                    var fileId = await _gridFs.UploadFromBytesAsync(fileName, imageBytes);

                    signatureIds.Add(fileId.ToString());
                }

                var filter = Builders<User>.Filter.Eq(u => u.Username, username);
                var update = Builders<User>.Update.Set("SignatureFileIds", signatureIds);

                await _users.UpdateOneAsync(filter, update);

                return Ok(new
                {
                    message = "Handwritten signatures registered successfully.",
                    fileIds = signatureIds
                });
            }
            catch (FormatException)
            {
                return BadRequest(new { message = "One or more signatures are not valid Base64 strings." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "GridFS storage failed", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> RegisterAccountHolder([FromBody] AccountRegistrationDto request)
        {
            if (request.Signatures == null || request.Signatures.Count != 3)
                return BadRequest(new { message = "Exactly 3 signature samples are required." });

            try
            {
                var fileIds = new List<string>();

                foreach (var b64 in request.Signatures)
                {
                    string cleanB64 = b64.Contains(",") ? b64.Split(',')[1] : b64;
                    byte[] imageBytes = Convert.FromBase64String(cleanB64);

                    var fileName = $"{request.AccountNumber}_ref_{Guid.NewGuid()}.png";
                    var fileId = await _gridFs.UploadFromBytesAsync(fileName, imageBytes);

                    fileIds.Add(fileId.ToString());
                }

                var newAccount = new AccountHolder
                {
                    FullName = request.FullName,
                    AccountNumber = request.AccountNumber,
                    ReferenceSignatureIds = fileIds,
                    CreatedAt = DateTime.UtcNow
                };

                await _accountsCollection.InsertOneAsync(newAccount);

                return Ok(new
                {
                    message = "Account Holder and 3 reference signatures registered successfully.",
                    accountId = newAccount.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Registration failed", error = ex.Message });
            }
        }
    }
}
