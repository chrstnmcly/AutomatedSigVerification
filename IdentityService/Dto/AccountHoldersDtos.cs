namespace IdentityService.Models.Dtos
{
    public record AccountRegistrationDto(
        string FullName,
        string AccountNumber,
        string SignatureBase64 
    );

    public record AccountResponseDto(
        string Id,
        string FullName,
        string AccountNumber,
        string ReferenceSignatureId,
        DateTime CreatedAt
    );
}
