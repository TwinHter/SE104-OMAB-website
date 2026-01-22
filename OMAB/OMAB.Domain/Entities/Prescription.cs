using System;

namespace OMAB.Domain.Entities;

public class Prescription
{
    public Prescription() { }

    public int Id { get; private set; }
    public int AppointmentId { get; private set; }
    public int MedicineId { get; private set; }
    public string Dosage { get; private set; } = "";
    public string Frequency { get; private set; } = "";

    public Medicine Medicine { get; private set; } = null!;
}
