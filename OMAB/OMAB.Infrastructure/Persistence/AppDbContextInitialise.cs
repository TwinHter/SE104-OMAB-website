using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OMAB.Domain.Constants;
using OMAB.Domain.Entities;
using OMAB.Domain.Enums;

namespace OMAB.Infrastructure.Persistence;

public class AppDbContextInitialise
{
    private readonly ILogger<AppDbContextInitialise> _logger;
    private readonly AppDbContext _context;
    public AppDbContextInitialise(ILogger<AppDbContextInitialise> logger, AppDbContext context)
    {
        _logger = logger;
        _context = context;
    }
    public async Task InitialiseAsync()
    {
        try
        {
            if (_context.Database.IsSqlite()) // Hoặc IsSqlServer()
            {
                await _context.Database.MigrateAsync();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initialising the database.");
            throw;
        }
    }

    public async Task SeedAsync(CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("🚀 Starting database seeding...");

            await SeedUsersAsync(cancellationToken);
            await SeedSpecialtiesAsync(cancellationToken);
            await SeedDoctorsPatientsAsync(cancellationToken);
            await SeedDiseasesAsync(cancellationToken);
            await SeedMedicinesAsync(cancellationToken);
            await SeedAppointmentsAsync(cancellationToken);
            await SeedDoctorSchedulesAsync(cancellationToken);

            _logger.LogInformation("✅ Database seeding completed.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    private async Task SeedDoctorSchedulesAsync(CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
    private async Task SeedUsersAsync(CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
    private async Task SeedSpecialtiesAsync(CancellationToken cancellationToken)
    {
        if (await _context.Specialties.AnyAsync(cancellationToken)) return;

        var specialty = new Specialty(
            "Tim mạch",
            "Chuyên khoa tim mạch"
        );

        _context.Specialties.Add(specialty);
        await _context.SaveChangesAsync(cancellationToken);
    }
    private async Task SeedDoctorsPatientsAsync(CancellationToken cancellationToken)
    {
        if (await _context.Doctors.AnyAsync(cancellationToken))
            return;

        var doctorUser = await _context.Users
            .FirstAsync(u => u.UserRole == UserRole.Doctor, cancellationToken);

        var patientUser = await _context.Users
            .FirstAsync(u => u.UserRole == UserRole.Patient, cancellationToken);
        var doctor = new Doctor(
            doctorUser.Id,
            experienceYears: 10,
            consultationFee: 200000
        );

        var patient = new Patient(
            patientUser.Id,
            BloodType.APlus,
            diseaseHistory: "Không có tiền sử bệnh nghiêm trọng",
            relativePhoneNumber: "333-444-5555"
        );

        _context.Doctors.Add(doctor);
        _context.Patients.Add(patient);

        await _context.SaveChangesAsync(cancellationToken);
    }
    private async Task SeedDiseasesAsync(CancellationToken cancellationToken)
    {
        if (await _context.Diseases.AnyAsync(cancellationToken))
            return;

        _context.Diseases.Add(
            new Disease("I10", "Tăng huyết áp")
        );

        await _context.SaveChangesAsync(cancellationToken);
    }
    private async Task SeedMedicinesAsync(CancellationToken cancellationToken)
    {
        if (await _context.Medicines.AnyAsync(cancellationToken))
            return;

        _context.Medicines.Add(
            new Medicine("Atorvastatin", "Thuốc hạ mỡ máu")
        );

        await _context.SaveChangesAsync(cancellationToken);
    }
    private async Task SeedAppointmentsAsync(CancellationToken cancellationToken)
    {
        if (await _context.Appointments.AnyAsync(cancellationToken))
            return;
        var doctor = await _context.Doctors.FirstAsync(cancellationToken);
        var patient = await _context.Patients.FirstAsync(cancellationToken);
        var disease = await _context.Diseases.FirstAsync(cancellationToken);
        _context.Appointments.Add(
            new Appointment(
                patient.UserId,
                doctor.UserId,
                disease.Id,
                DateTime.UtcNow,
                200000,
                "Chẩn đoán ban đầu"
            )
        );
        await _context.SaveChangesAsync(cancellationToken);
    }
}
