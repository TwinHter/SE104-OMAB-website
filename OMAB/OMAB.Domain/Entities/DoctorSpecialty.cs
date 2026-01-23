using System;

namespace OMAB.Domain.Entities;

public class DoctorSpecialty
{
    private DoctorSpecialty() { }
    public DoctorSpecialty(int doctorId, int specialtyId)
    {
        DoctorId = doctorId;
        SpecialtyId = specialtyId;
    }
    public int DoctorId { get; private set; }
    public Doctor Doctor { get; private set; } = null!;
    public int SpecialtyId { get; private set; }
    public Specialty Specialty { get; private set; } = null!;
}
