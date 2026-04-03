namespace IdentityService.Models.Dtos
{
    public record VerificationRequestDto(
        string AccountNumber,
        string NewSignatureBase64
    );

    public record AiResult(double Similarity);
}
