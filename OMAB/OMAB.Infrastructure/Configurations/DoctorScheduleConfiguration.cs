using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OMAB.Domain.Entities;

namespace OMAB.Infrastructure.Configurations;

public class DoctorScheduleConfiguration : IEntityTypeConfiguration<DoctorSchedule>
{
    public void Configure(EntityTypeBuilder<DoctorSchedule> builder)
    {
        builder.ToTable("DoctorSchedules");
        builder.HasKey(ds => ds.Id);

        builder.Property(ds => ds.DayOfWeek)
               .IsRequired();

        builder.Property(ds => ds.StartTime)
               .IsRequired();

        builder.Property(ds => ds.EndTime)
               .IsRequired();

        builder.HasOne<Doctor>()
               .WithMany(d => d.DoctorSchedules)
                .HasForeignKey(ds => ds.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);
    }
}