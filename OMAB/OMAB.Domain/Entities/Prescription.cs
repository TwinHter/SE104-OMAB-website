using System;

namespace OMAB.Domain.Entities;

public class Prescription
{
    public Prescription() { }
    public Prescription(int appointmentId, int medicineId, string dosage, string frequency)
    {
        AppointmentId = appointmentId;
        MedicineId = medicineId;
        Dosage = dosage;
        Frequency = frequency;
    }
    public void Update(string dosage, string frequency)
    {
        Dosage = dosage;
        Frequency = frequency;
    }
    public int Id { get; private set; }
    public int AppointmentId { get; private set; }
    public int MedicineId { get; private set; }
    public string Dosage { get; private set; } = "";
    public string Frequency { get; private set; } = "";

    public Medicine Medicine { get; private set; } = null!;
}
