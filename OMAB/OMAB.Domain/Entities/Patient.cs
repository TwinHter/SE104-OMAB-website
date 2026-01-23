using System;
using OMAB.Domain.Enums;

namespace OMAB.Domain.Entities;

public class Patient
{
    public Patient() { }
    public Patient(int id, BloodType bloodType, string diseaseHistory, string relativePhoneNumber)
    {
        UserId = id;
        BloodType = bloodType;
        DiseaseHistory = diseaseHistory;
        RelativePhoneNumber = relativePhoneNumber;
    }
    public int UserId { get; set; }
    public BloodType BloodType { get; set; } = BloodType.Unknown;
    public string DiseaseHistory { get; set; } = "";
    public string RelativePhoneNumber { get; set; } = "";

    public User User { get; set; } = null!;
}
