using System;

namespace OMAB.Domain.Entities;

public class Medicine
{
    private Medicine() { }
    public Medicine(string name, string unit)
    {
        Name = name;
        Unit = unit;
    }
    public void UpdateInfo(string name, string unit)
    {
        if (name != null) Name = name;
        if (unit != null) Unit = unit;
    }

    public int Id { get; private set; }
    public string Name { get; private set; } = "";
    public string Unit { get; private set; } = "";
}
