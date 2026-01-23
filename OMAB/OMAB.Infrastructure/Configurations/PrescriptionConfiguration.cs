using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OMAB.Domain.Entities;

namespace OMAB.Infrastructure.Configurations;

public class PrescriptionConfiguration : IEntityTypeConfiguration<Prescription>
{
    public void Configure(EntityTypeBuilder<Prescription> builder)
    {
        builder.ToTable("Prescriptions");
        builder.HasKey(p => p.Id);
        builder.HasOne(p => p.Medicine)
               .WithMany()
               .HasForeignKey(p => p.MedicineId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
