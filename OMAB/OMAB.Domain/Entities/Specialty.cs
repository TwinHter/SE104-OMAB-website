using System;

namespace OMAB.Domain.Entities;

public class Specialty
{
    private Specialty() { }
    public Specialty(string name, string description)
    {
        Name = name;
        Description = description;
    }
    public void UpdateInfo(string? name, string? description)
    {
        if (name != null) Name = name;
        if (description != null) Description = description;
    }

    public int Id { get; private set; }
    public string Name { get; private set; } = "";
    public string Description { get; private set; } = "";
}
