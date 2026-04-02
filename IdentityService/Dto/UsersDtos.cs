namespace IdentityService.Models.Dtos
{
    public class RoleUpdateDto
    {
        public string RoleName { get; set; } = string.Empty;
    }

    public class UserRegistrationDto
    {
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = "P@ssword123"; 
        public string RoleName { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }

    public class UserResponseDto
    {
        public string Username { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    public record StatusUpdateDto(bool IsActive);
}
