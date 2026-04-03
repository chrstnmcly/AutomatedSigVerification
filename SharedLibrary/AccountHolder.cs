using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SharedLibrary.Models
{
    public class AccountHolder
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string AccountNumber { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public List<string> ReferenceSignatureIds { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public GraphologyFeatures? Graphology { get; set; }
    }

    public class GraphologyFeatures
    {
        public double AvgSlant { get; set; }
        public double PressureIntensity { get; set; }
    }
}
