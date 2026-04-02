using MongoDB.Driver;
using System.Security.Authentication;

namespace IdentityService.Data
{
    public class MongoDbContext
    {
        public IMongoDatabase Database { get; }

        public MongoDbContext(IConfiguration configuration)
        {
            var connectionString = configuration.GetValue<string>("MongoDbSettings:ConnectionString");
            var settings = MongoClientSettings.FromConnectionString(connectionString);

            settings.SslSettings = new SslSettings
            {
                EnabledSslProtocols = SslProtocols.Tls12,
                ServerCertificateValidationCallback = (sender, certificate, chain, errors) => true
            };

            var client = new MongoClient(settings);
            Database = client.GetDatabase(configuration.GetValue<string>("MongoDbSettings:DatabaseName"));
        }

        public IMongoCollection<T> GetCollection<T>(string name) => Database.GetCollection<T>(name);
    }
}
