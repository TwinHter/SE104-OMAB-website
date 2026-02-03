using System;
using OMAB.Domain.Enums;
using System.Collections.Generic;
using OMAB.Domain.Common;

namespace OMAB.Domain.Entities;

public class Appointment
{
    private Appointment()
    {
        CreatedAt = DateTime.UtcNow;
    }

    public Appointment(int patientId, int doctorId, int? diseaseId, DateTime appointmentDate, decimal fee, string notes = "", DateTime? appointmentEndTime = null)
    {
        PatientId = patientId;
        DoctorId = doctorId;
        DiseaseId = diseaseId;
        AppointmentDate = appointmentDate;
        Status = AppointmentStatus.Scheduled;
        Fee = fee;
        PaymentStatus = PaymentStatus.Unpaid;
        Notes = notes;
        AppointmentEndTime = appointmentEndTime ?? appointmentDate.AddMinutes(30);
        CreatedAt = DateTime.UtcNow;
    }
    public void UpdateAppointment(AppointmentStatus? status, decimal? fee, string? notes = null, DateTime? appointmentDate = null, DateTime? appointmentEndTime = null, int? diseaseId = null)
    {
        if (status != null) Status = status.Value;
        if (fee != null) Fee = fee.Value;
        if (notes != null) Notes = notes;
        if (appointmentDate != null) AppointmentDate = appointmentDate.Value;
        if (appointmentEndTime != null) AppointmentEndTime = appointmentEndTime.Value;
        if (diseaseId != null) DiseaseId = diseaseId.Value;
    }

    public void PatientUpdate(string patientNotes)
    {
        PatientNotes = patientNotes;

    }
    public void UpdatePaymentStatus(PaymentStatus paymentStatus)
    {
        PaymentStatus = paymentStatus;
    }
    // Trong class Appointment
    public DomainError? AddReview(Review review)
    {
        // 1. Bảo vệ nghiệp vụ (Invariant Check)
        if (this.Review != null) return new DomainError(false, "Appointment already has a review.");
        this.Review = review;
        return null;
    }

    public void RemoveReview()
    {
        if (this.Review == null) return;
        this.Review = null;
        this.ReviewId = null;
    }

    public void UpsertPrescription(List<Prescription> newItems)
    {
        var incomingMedicineIds = newItems.Select(p => p.MedicineId).ToHashSet();

        var itemsToRemove = Prescriptions
            .Where(existing => !incomingMedicineIds.Contains(existing.MedicineId))
            .ToList();
        foreach (var item in itemsToRemove)
            Prescriptions.Remove(item);

        foreach (var incomingItem in newItems)
        {
            var existingItem = Prescriptions
                .FirstOrDefault(p => p.MedicineId == incomingItem.MedicineId);

            if (existingItem == null)
                Prescriptions.Add(incomingItem);
            else
                existingItem.Update(incomingItem.Dosage, incomingItem.Frequency);
        }
    }


    public int Id { get; private set; }
    public int PatientId { get; private set; }
    public int DoctorId { get; private set; }
    public int? DiseaseId { get; private set; }
    public DateTime AppointmentDate { get; private set; }
    public DateTime AppointmentEndTime { get; private set; }
    public AppointmentStatus Status { get; private set; }
    public decimal Fee { get; private set; }
    public PaymentStatus PaymentStatus { get; private set; }
    public string Notes { get; private set; } = "";
    public string? PatientNotes { get; private set; } = "";
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;


    public int? ReviewId { get; private set; }
    public Review? Review { get; private set; }
    public ICollection<Prescription> Prescriptions { get; private set; } = new List<Prescription>();
    public Disease Disease { get; private set; } = null!;
    public Doctor Doctor { get; private set; } = null!;
    public Patient Patient { get; private set; } = null!;
}
