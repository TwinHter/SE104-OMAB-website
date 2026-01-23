using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OMAB.Domain.Entities;

namespace OMAB.Infrastructure.Configurations;

public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.ToTable("Appointments");
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Status).HasConversion<int>().IsRequired();
        builder.Property(a => a.PaymentStatus).HasConversion<int>().IsRequired();
        builder.Property(a => a.Notes).HasMaxLength(200);
        builder.Property(a => a.Fee).HasPrecision(18, 3).IsRequired();

        builder.HasOne(a => a.Patient).WithMany().HasForeignKey(a => a.PatientId).OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.Doctor).WithMany().HasForeignKey(a => a.DoctorId).OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.Disease).WithMany().HasForeignKey(a => a.DiseaseId).OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(a => a.Prescriptions).WithOne().HasForeignKey(p => p.AppointmentId).OnDelete(DeleteBehavior.Cascade);
    }
}
