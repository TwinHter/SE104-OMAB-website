using Microsoft.EntityFrameworkCore;
using Backend.Core.Models;
using Backend.Core.Enums;
using System.Text.Json;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Linq;

namespace Backend.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Medication> Medications { get; set; }
        public DbSet<DoctorReview> DoctorReviews { get; set; }
        public DbSet<AppointmentPatientReview> AppointmentPatientReviews { get; set; }
        public DbSet<Relative> Relatives { get; set; }
        public DbSet<UserNotification> UserNotifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Type)
                      .HasConversion<int>(); // Store enum as int

                // One-to-one relationship with Doctor (DoctorProfile extends User concept)
                entity.HasOne(u => u.DoctorProfile)
                        .WithOne(d => d.User)
                        .HasForeignKey<Doctor>(d => d.Id)
                        .IsRequired(false)
                        .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Doctor entity
            _ = modelBuilder.Entity<Doctor>(entity =>
{
    entity.HasKey(e => e.Id);

    entity.Property(e => e.Availability)
        .HasConversion(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
            v => JsonSerializer.Deserialize<Dictionary<string, List<string>>>(v, (JsonSerializerOptions?)null) ?? new Dictionary<string, List<string>>()
        )
        .Metadata.SetValueComparer(new ValueComparer<Dictionary<string, List<string>>>(
            // Equals
            (d1, d2) =>
                d1 != null && d2 != null &&
                d1.Count == d2.Count &&
                !d1.Except(d2).Any() &&
                d1.All(kv => d2.ContainsKey(kv.Key) &&
                             kv.Value.SequenceEqual(d2[kv.Key])),
            // HashCode
            d =>
                d == null ? 0 :
                d.Aggregate(0, (acc, kv) => HashCode.Combine(
                    acc,
                    kv.Key.GetHashCode(),
                    kv.Value.Aggregate(0, (acc2, item) => HashCode.Combine(acc2, item.GetHashCode()))
                )),
            // Snapshot
            d => d.ToDictionary(kv => kv.Key, kv => new List<string>(kv.Value))
        ));
});


            // Configure Appointment entity
            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Status)
                      .HasConversion<int>();
                entity.Property(e => e.OutcomeStatus)
                      .HasConversion<int?>();

                // Relationship with Doctor (User of Doctor)
                entity.HasOne(a => a.Doctor)
                      .WithMany(u => u.DoctorAppointments)
                      .HasForeignKey(a => a.DoctorId)
                      .OnDelete(DeleteBehavior.Restrict); // Don't delete doctor if appointment is deleted

                // Relationship with Patient (User of Patient)
                entity.HasOne(a => a.Patient)
                      .WithMany(u => u.PatientAppointments)
                      .HasForeignKey(a => a.PatientId)
                      .OnDelete(DeleteBehavior.Restrict); // Don't delete patient if appointment is deleted

                // One-to-one relationship with PatientReview
                entity.HasOne(a => a.PatientReview)
                      .WithOne(pr => pr.Appointment)
                      .HasForeignKey<AppointmentPatientReview>(pr => pr.AppointmentId)
                      .IsRequired(false) // Review is optional
                      .OnDelete(DeleteBehavior.Cascade); // Delete review if appointment is deleted
            });

            // Configure Medication entity
            modelBuilder.Entity<Medication>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(m => m.Appointment)
                      .WithMany(a => a.Prescription)
                      .HasForeignKey(m => m.AppointmentId)
                      .OnDelete(DeleteBehavior.Cascade); // Delete medication if appointment is deleted
            });

            // Configure DoctorReview entity
            modelBuilder.Entity<DoctorReview>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(dr => dr.Doctor)
                      .WithMany(d => d.Reviews)
                      .HasForeignKey(dr => dr.DoctorId)
                      .OnDelete(DeleteBehavior.Cascade); // Delete review if doctor is deleted
            });

            // Configure Relative entity
            modelBuilder.Entity<Relative>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(r => r.User)
                      .WithMany(u => u.Relatives)
                      .HasForeignKey(r => r.UserId)
                      .OnDelete(DeleteBehavior.Cascade); // Delete relative if user is deleted
            });

            // Configure UserNotification entity
            modelBuilder.Entity<UserNotification>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(n => n.User)
                      .WithMany(u => u.Notifications)
                      .HasForeignKey(n => n.UserId)
                      .OnDelete(DeleteBehavior.Cascade); // Delete notification if user is deleted
            });

            // Seed initial data (optional, but good for quick testing)
            modelBuilder.Entity<User>().HasData(
                new User { Id = "patient1", Name = "Alice Patient", Email = "alice@example.com", Type = UserRole.Patient, PasswordHash = "dummy_hash", Salt = "dummy_salt", AvatarUrl = "https://placehold.co/100x100.png?text=AP" },
                new User { Id = "doc1", Name = "BS. Emily Carter", Email = "emily.carter@example.com", Type = UserRole.Doctor, PasswordHash = "dummy_hash", Salt = "dummy_salt", AvatarUrl = "https://placehold.co/120x120.png?text=EC" },
                new User { Id = "admin1", Name = "Admin User", Email = "admin@example.com", Type = UserRole.Admin, PasswordHash = "dummy_hash", Salt = "dummy_salt", AvatarUrl = "https://placehold.co/100x100.png?text=AD" }
            );

            // Define fixed dates for seeding. You can pick dates in the past/future.
            // Ensure these dates are consistent every time your application starts.
            var fixedAvailabilityDate1 = new DateTime(2025, 6, 17); // Tomorrow if running on June 16, 2025
            var fixedAvailabilityDate2 = new DateTime(2025, 6, 18); // Day after tomorrow
            var fixedAppointmentDate1 = new DateTime(2025, 6, 17, 10, 0, 0); // Tomorrow 10 AM
            var fixedAppointmentDate2 = new DateTime(2025, 6, 11, 14, 0, 0); // A few days ago 2 PM
            var fixedReviewDate = new DateTime(2025, 6, 9, 10, 0, 0, DateTimeKind.Utc); // A specific date in UTC
            var fixedNotificationDate = new DateTime(2025, 6, 16, 12, 0, 0, DateTimeKind.Utc); // Specific date in UTC

            modelBuilder.Entity<Doctor>().HasData(
                new Doctor
                {
                    Id = "doc1",
                    Specialty = "Tim Mạch",
                    ConsultationFee = 350000,
                    ExperienceYears = 12,
                    Location = "Phòng Khám Tim Mạch Trung Tâm, 123 Đường Sức Khỏe",
                    Availability = new Dictionary<string, List<string>> {
                { fixedAvailabilityDate1.ToString("yyyy-MM-dd"), new List<string> { "09:00", "10:00", "11:00", "14:00" } },
                { fixedAvailabilityDate2.ToString("yyyy-MM-dd"), new List<string> { "09:30", "10:30", "15:00" } }
                    },
                    AvgRating = 4.5m,
                    TotalAppointments = 150
                }
            );

            modelBuilder.Entity<Appointment>().HasData(
                new Appointment
                {
                    Id = "appt1",
                    Date = fixedAppointmentDate1,
                    DoctorId = "doc1",
                    PatientId = "patient1",
                    Symptoms = "Đau ngực nhẹ, khó thở khi vận động",
                    Status = AppointmentStatus.Scheduled,
                    Cost = 350000,
                    Notes = "Initial checkup",
                },
                new Appointment
                {
                    Id = "appt2",
                    Date = fixedAppointmentDate2,
                    DoctorId = "doc1",
                    PatientId = "patient1",
                    Symptoms = "Sốt cao, ho khan",
                    Status = AppointmentStatus.Completed,
                    Cost = 300000,
                    Notes = "Đã kê đơn thuốc hạ sốt và kháng sinh",
                    OutcomeStatus = AppointmentOutcomeStatus.CompletedWithNotes
                }
            );

            modelBuilder.Entity<Medication>().HasData(
                new Medication { Id = "med1_appt2", AppointmentId = "appt2", Name = "Paracetamol", Dosage = "500mg", Frequency = "Ngày 2 lần", Duration = "3 ngày" },
                new Medication { Id = "med2_appt2", AppointmentId = "appt2", Name = "Amoxicillin", Dosage = "250mg", Frequency = "Ngày 3 lần", Duration = "5 ngày" }
            );

            modelBuilder.Entity<DoctorReview>().HasData(
                new DoctorReview { Id = "drev1_doc1", DoctorId = "doc1", PatientName = "Nguyễn Văn A", Rating = 5, Comment = "Bác sĩ rất tận tâm và chuyên nghiệp.", Date = fixedReviewDate }
            );

            modelBuilder.Entity<UserNotification>().HasData(
                new UserNotification { Id = "notif1_patient1", UserId = "patient1", Context = "Lịch hẹn của bạn vào 10:00 ngày mai đã được xác nhận.", DateTime = fixedNotificationDate, IsRead = false, Type = "appointment_confirmed", RelatedLink = "/appointments" }
            );

            modelBuilder.Entity<Relative>().HasData(
                new Relative { Id = "rel1_patient1", UserId = "patient1", Name = "Nguyễn Văn B", Relationship = "Con", Phone = "0901234567" }
            );
        }
    }
}