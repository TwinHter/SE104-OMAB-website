using System;

namespace OMAB.Domain.Entities;

public class Disease
{
    private Disease() { } // EF Core Constructor

    public Disease(string icd10Code, string name)
    {
        Icd10Code = icd10Code;
        Name = name;
    }

    public int Id { get; private set; }
    public string Icd10Code { get; private set; } = null!;
    public string Name { get; private set; } = null!;

    public void UpdateInfo(string name, string icd10Code)
    {
        Name = name;
        Icd10Code = icd10Code;
    }
}
