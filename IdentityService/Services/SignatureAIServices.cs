using IdentityService.Models.Dtos;

namespace IdentityService.Services
{
    public interface IAIService
    {
        Task<double> GetSimilarityScoreAsync(byte[] refImg, byte[] testImg);
    }

    public class SignatureAIService : IAIService
    {
        private readonly IHttpClientFactory _clientFactory;

        public SignatureAIService(IHttpClientFactory factory)
        {
            _clientFactory = factory;
        }

        public async Task<double> GetSimilarityScoreAsync(byte[] refImg, byte[] testImg)
        {
            var client = _clientFactory.CreateClient("SignatureAI");

            using var content = new MultipartFormDataContent();
            content.Add(new ByteArrayContent(refImg), "file1", "ref.png");
            content.Add(new ByteArrayContent(testImg), "file2", "test.png");

            var response = await client.PostAsync("compare", content);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<AiResult>();
                return result?.Similarity ?? 0;
            }

            return 0;
        }
    }
}
