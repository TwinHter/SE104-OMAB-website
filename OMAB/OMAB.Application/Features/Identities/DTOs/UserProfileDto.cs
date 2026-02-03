using AutoMapper;
using OMAB.Domain.Entities;
using OMAB.Domain.Enums;

namespace OMAB.Application.Features.Profiles.DTOs;

public record UserProfileDto
{
    public int Id { get; init; }
    public string Email { get; init; } = null!;
    public string FullName { get; init; } = null!;
    public UserRole UserRole { get; init; }
    public DateTime DateOfBirth { get; init; }

    public DoctorInfo? Doctor { get; set; }
    public PatientInfo? Patient { get; set; }

    public class DoctorInfo
    {
        public int ExperienceYears { get; init; }
        public decimal ConsultationFee { get; init; }
        public bool IsActive { get; init; }
        public decimal Rating { get; init; }
        public List<string> Specializations { get; init; } = new();
    }

    public class PatientInfo
    {
        public string DiseaseHistory { get; init; } = null!;
        public string RelativePhoneNumber { get; init; } = null!;
        public BloodType BloodType { get; init; }
    }

    public static UserProfileDto Create(User user, IMapper mapper, Doctor? doctor = null, Patient? patient = null)
    {
        var dto = mapper.Map<UserProfileDto>(user);

        if (doctor != null)
            dto.Doctor = mapper.Map<DoctorInfo>(doctor);

        if (patient != null)
            dto.Patient = mapper.Map<PatientInfo>(patient);

        return dto;
    }
}