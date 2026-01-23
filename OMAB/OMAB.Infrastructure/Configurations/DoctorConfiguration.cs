using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OMAB.Domain.Entities;

namespace OMAB.Infrastructure.Configurations;

public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
{
    public void Configure(EntityTypeBuilder<Doctor> builder)
    {
        builder.ToTable("Doctors");
        builder.HasKey(d => d.UserId);

        builder.Property(d => d.Rating).HasPrecision(18, 2);

        builder.Property(d => d.Rating)
            .HasPrecision(3, 2)
            .HasDefaultValue(0);

        builder.HasOne(d => d.User)
                .WithOne(u => u.Doctor)
                .HasForeignKey<Doctor>(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
    }
}
