using System;
using OMAB.Domain.Enums;

namespace OMAB.Domain.Entities;

public class Patient
{
    public int UserId { get; set; }
    public BloodType BloodType { get; set; } = BloodType.Unknown;
    public string DiseaseHistory { get; set; } = "";
    public string RelativePhoneNumber { get; set; } = "";

    public User User { get; set; } = null!;
}
