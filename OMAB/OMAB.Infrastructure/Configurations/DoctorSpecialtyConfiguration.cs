using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OMAB.Domain.Entities;

namespace OMAB.Infrastructure.Configurations;

public class DoctorSpecialtyConfiguration : IEntityTypeConfiguration<DoctorSpecialty>
{
    public void Configure(EntityTypeBuilder<DoctorSpecialty> builder)
    {
        builder.ToTable("DoctorSpecialties");
        builder.HasKey(ds => new { ds.DoctorId, ds.SpecialtyId });

        builder.HasOne(ds => ds.Doctor)
               .WithMany(d => d.DoctorSpecialties)
               .HasForeignKey(ds => ds.DoctorId).OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ds => ds.Specialty)
               .WithMany()
               .HasForeignKey(ds => ds.SpecialtyId).OnDelete(DeleteBehavior.Cascade);
    }
}
