using System;
using OMAB.Domain.Entities;

namespace OMAB.Application.Features.Appointments.DTOs;

public record ReviewDto(int Id, int Rating, string Comment, string PatientName, DateTime CreateAt);
