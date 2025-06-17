using System.Collections.Generic;

namespace Backend.Api.DTOs
{
    // For GET /api/relatives response
    public class RelativeDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Relationship { get; set; }
        public string? Phone { get; set; }
    }
    public class CreateRelativeDto
    {
        public string Name { get; set; }
        public string Relationship { get; set; }
        public string? Phone { get; set; }
    }
    public class UpdateRelativeDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Relationship { get; set; }
        public string? Phone { get; set; }
    }
    public class DeleteRelativeDto
    {
        public string Id { get; set; }
    }
    public class RelativeListDto
    {
        public List<RelativeDto> Relatives { get; set; }
    }
}