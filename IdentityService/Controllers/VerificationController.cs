using IdentityService.Data;
using IdentityService.Models.Dtos;
using IdentityService.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using SharedLibrary.Models;

namespace IdentityService.Controllers
{
    [ApiController]
    [Route("api/verification")]
    public class VerificationController : ControllerBase
    {
        private readonly IMongoCollection<AccountHolder> _accounts;
        private readonly IGridFSBucket _gridFs;
        private readonly IAIService _aiService;

        public VerificationController(MongoDbContext context, IAIService aiService)
        {
            _accounts = context.GetCollection<AccountHolder>("AccountHolders");
            _gridFs = new GridFSBucket(context.Database);
            _aiService = aiService;
        }

        [HttpPost("verify")]
        public async Task<IActionResult> Verify([FromBody] VerificationRequestDto request)
        {
            var account = await _accounts.Find(a => a.AccountNumber == request.AccountNumber).FirstOrDefaultAsync();
            if (account == null) return NotFound("Account not found.");

            if (account.ReferenceSignatureIds == null || !account.ReferenceSignatureIds.Any())
                return BadRequest("No reference signatures found for this account.");

            double totalScore = 0;

            try
            {
                string cleanB64 = request.NewSignatureBase64.Contains(",")
                    ? request.NewSignatureBase64.Split(',')[1]
                    : request.NewSignatureBase64;

                byte[] testImageBytes = Convert.FromBase64String(cleanB64);

                foreach (var refId in account.ReferenceSignatureIds)
                {
                    byte[] refBytes = await _gridFs.DownloadAsBytesAsync(new ObjectId(refId));

                    double score = await _aiService.GetSimilarityScoreAsync(refBytes, testImageBytes);
                    totalScore += score;
                }

                double finalConfidence = totalScore / account.ReferenceSignatureIds.Count;

                return Ok(new
                {
                    confidence = finalConfidence,
                    status = finalConfidence >= 0.90 ? "Match" : "Flagged"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Verification failed", error = ex.Message });
            }
        }
    }
}
