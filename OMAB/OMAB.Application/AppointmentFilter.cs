using OMAB.Domain.Enums;

namespace OMAB.Application.Models;

public class AppointmentFilter
{
    public int? PatientId { get; set; }
    public int? DoctorId { get; set; }
    public AppointmentStatus? Status { get; set; }
    public PaymentStatus? PaymentStatus { get; set; }
}
