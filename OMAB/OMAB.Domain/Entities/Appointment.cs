using System;
using OMAB.Domain.Enums;
using System.Collections.Generic;

namespace OMAB.Domain.Entities;

public class Appointment
{
    private Appointment() { }

    public Appointment(int patientId, int doctorId, int diseaseId, DateTime appointmentDate, decimal fee)
    {
        PatientId = patientId;
        DoctorId = doctorId;
        DiseaseId = diseaseId;
        AppointmentDate = appointmentDate;
        Status = AppointmentStatus.Scheduled;
        Fee = fee;
        PaymentStatus = PaymentStatus.Unpaid;
    }
    public void UpdateAppointment(AppointmentStatus? status, decimal? fee, PaymentStatus? paymentStatus)
    {
        if (status != null) Status = status.Value;
        if (fee != null) Fee = fee.Value;
        if (paymentStatus != null) PaymentStatus = paymentStatus.Value;
    }


    public int Id { get; private set; }
    public int PatientId { get; private set; }
    public int DoctorId { get; private set; }
    public int DiseaseId { get; private set; }
    public DateTime AppointmentDate { get; private set; }
    public AppointmentStatus Status { get; private set; }
    public decimal Fee { get; private set; }
    public PaymentStatus PaymentStatus { get; private set; }

    public int? ReviewId { get; private set; }
    public Review? Review { get; private set; }
    public ICollection<Prescription> Prescriptions { get; private set; } = new List<Prescription>();
    public Disease Disease { get; private set; } = null!;
    public Doctor Doctor { get; private set; } = null!;
    public Patient Patient { get; private set; } = null!;
}
