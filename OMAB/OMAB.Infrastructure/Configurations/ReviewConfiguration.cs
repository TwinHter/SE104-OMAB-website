using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OMAB.Domain.Constants;
using OMAB.Domain.Entities;

namespace OMAB.Infrastructure.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable("Reviews");
        builder.HasKey(r => r.Id);

        builder.ToTable(t => t.HasCheckConstraint("CK_Review_Rating", $"Rating >= {ReviewConstants.MinRating} AND Rating <= {ReviewConstants.MaxRating}")); // Rating constraint 

        builder.Property(r => r.Comment).HasMaxLength(300);
        builder.Property(r => r.AppointmentId).IsRequired();

        builder.HasOne(r => r.Appointment)
               .WithOne(a => a.Review)
               .HasForeignKey<Review>(r => r.AppointmentId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
