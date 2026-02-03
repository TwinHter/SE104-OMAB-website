using System;
using MediatR;
using OMAB.Application.Cores;
using OMAB.Application.Features.Appointments.DTOs;
using OMAB.Application.Interfaces;

namespace OMAB.Application.Features.Appointments.Queries;

public class GetDoctorAvailableSlot
{
    public record Query(int DoctorId, DateTime Date) : IRequest<Result<List<DoctorScheduleItemDto>>>;

    public class Handler(
    IDoctorRepository doctorRepository,
    IAppointmentRepository appointmentRepository
) : IRequestHandler<Query, Result<List<DoctorScheduleItemDto>>>
    {
        public async Task<Result<List<DoctorScheduleItemDto>>> Handle(Query request, CancellationToken ct)
        {
            var scheduleTask = doctorRepository.GetScheduleByDoctorAndDayAsync(request.DoctorId, request.Date.DayOfWeek, ct);
            var appointmentsTask = appointmentRepository.GetDoctorAppointmentsOnDateAsync(request.DoctorId, DateOnly.FromDateTime(request.Date), ct);

            await Task.WhenAll(scheduleTask, appointmentsTask);

            var doctorSchedules = scheduleTask.Result;
            var existingAppointments = appointmentsTask.Result;

            if (doctorSchedules == null || doctorSchedules.Count == 0)
                return Result<List<DoctorScheduleItemDto>>.Success(new List<DoctorScheduleItemDto>());

            var bookedTimeSlots = existingAppointments
                .Select(a => a.AppointmentDate.TimeOfDay)
                .ToHashSet();

            var availableSlots = new List<DoctorScheduleItemDto>();

            var now = DateTime.Now;
            bool isToday = request.Date.Date == now.Date;

            foreach (var schedule in doctorSchedules)
            {
                var slotDuration = TimeSpan.FromMinutes(schedule.SlotDurationInMinutes);

                for (var time = schedule.StartTime; time + slotDuration <= schedule.EndTime; time += slotDuration)
                {
                    if (bookedTimeSlots.Contains(time))
                        continue;

                    if (isToday && time < now.TimeOfDay)
                        continue;

                    availableSlots.Add(new DoctorScheduleItemDto
                    {
                        DayOfWeek = schedule.DayOfWeek,
                        StartTime = time,
                        EndTime = time + slotDuration
                    });
                }
            }
            availableSlots = availableSlots.OrderBy(s => s.StartTime).ToList();

            return Result<List<DoctorScheduleItemDto>>.Success(availableSlots);
        }
    }
}
