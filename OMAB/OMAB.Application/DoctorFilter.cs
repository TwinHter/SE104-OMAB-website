using System;

namespace OMAB.Application;

public class DoctorFilter
{
    public int? SpecialtyId { get; set; }
    public int? MinimumExperience { get; set; } = 0;
    public int? MinimumRating { get; set; } = 0;
    public bool? IsAvailable { get; set; }
    public int? MinimumConsultationFee { get; set; } = 0;
    public int? MaximumConsultationFee { get; set; } = int.MaxValue;
}
