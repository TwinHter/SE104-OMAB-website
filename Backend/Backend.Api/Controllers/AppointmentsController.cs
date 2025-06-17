using Microsoft.AspNetCore.Mvc;
using Backend.Api.DTOs;
using Backend.Core.Enums;
using Backend.Core.Interfaces;
using Backend.Core.Models;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/appointments")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IUserRepository _userRepository;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IGenericRepository<Medication> _medicationRepository;
        private readonly IGenericRepository<AppointmentPatientReview> _patientReviewRepository;


        public AppointmentsController(
            IAppointmentRepository appointmentRepository,
            IUserRepository userRepository,
            IDoctorRepository doctorRepository,
            IGenericRepository<Medication> medicationRepository,
            IGenericRepository<AppointmentPatientReview> patientReviewRepository)
        {
            _appointmentRepository = appointmentRepository;
            _userRepository = userRepository;
            _doctorRepository = doctorRepository;
            _medicationRepository = medicationRepository;
            _patientReviewRepository = patientReviewRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAppointments()
        {
            try
            {
                var appointments = await _appointmentRepository.GetAllAppointmentsAsync();
                var appointmentDtos = appointments.Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    Date = a.Date.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    Doctor = new AppointmentDoctorInfoDto
                    {
                        Id = a.Doctor.Id,
                        Name = a.Doctor.Name,
                        Specialty = a.Doctor.DoctorProfile?.Specialty ?? "N/A", // Assume DoctorProfile is loaded
                        AvatarUrl = a.Doctor.AvatarUrl
                    },
                    PatientId = a.PatientId,
                    PatientName = a.Patient.Name,
                    Symptoms = a.Symptoms,
                    Notes = a.Notes,
                    Prescription = a.Prescription?.Select(m => new MedicationDto
                    {
                        Id = m.Id,
                        Name = m.Name,
                        Dosage = m.Dosage,
                        Frequency = m.Frequency,
                        Duration = m.Duration
                    }).ToList(),
                    Status = a.Status.ToString().ToLower(),
                    Cost = a.Cost,
                    PatientReview = a.PatientReview != null ? new PatientReviewInputDto
                    {
                        Rating = a.PatientReview.Rating,
                        Comment = a.PatientReview.Comment
                    } : null,
                    OutcomeStatus = a.OutcomeStatus?.ToString().ToLower()
                }).ToList();

                return Ok(appointmentDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching appointments", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Verify Doctor existence
                var doctorUser = await _userRepository.GetUserWithDoctorProfileAsync(request.Doctor.Id);
                if (doctorUser == null || doctorUser.Type != UserRole.Doctor || doctorUser.DoctorProfile == null)
                {
                    return BadRequest(new { message = "Invalid doctor ID provided." });
                }

                // Verify Patient existence
                var patientUser = await _userRepository.GetByIdAsync(request.PatientId);
                if (patientUser == null || patientUser.Type != UserRole.Patient)
                {
                    return BadRequest(new { message = "Invalid patient ID provided." });
                }

                // Combine Date and Time
                if (!DateTime.TryParse($"{request.Date} {request.Time}", out DateTime appointmentDateTime))
                {
                    return BadRequest(new { message = "Invalid date or time format." });
                }

                var newAppointment = new Appointment
                {
                    Id = Guid.NewGuid().ToString(),
                    Date = appointmentDateTime,
                    DoctorId = doctorUser.Id,
                    PatientId = patientUser.Id,
                    Symptoms = request.Symptoms,
                    Status = AppointmentStatus.PendingConfirmation, // Default status
                    Cost = request.Cost,
                    Notes = null,
                    Prescription = new List<Medication>(),
                    OutcomeStatus = null,
                    PatientReview = null
                };

                await _appointmentRepository.AddAsync(newAppointment);

                // Construct response DTO
                var responseDto = new AppointmentDto
                {
                    Id = newAppointment.Id,
                    Date = newAppointment.Date.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    Doctor = new AppointmentDoctorInfoDto
                    {
                        Id = doctorUser.Id,
                        Name = doctorUser.Name,
                        Specialty = doctorUser.DoctorProfile.Specialty
                    },
                    PatientId = patientUser.Id,
                    PatientName = patientUser.Name,
                    Symptoms = newAppointment.Symptoms,
                    Status = newAppointment.Status.ToString().ToLower(),
                    Cost = newAppointment.Cost,
                    Notes = newAppointment.Notes,
                    Prescription = newAppointment.Prescription.Select(m => new MedicationDto { Id = m.Id, Name = m.Name, Dosage = m.Dosage, Frequency = m.Frequency, Duration = m.Duration }).ToList(),
                    PatientReview = null,
                    OutcomeStatus = null
                };

                return CreatedAtAction(nameof(GetAppointments), new { id = newAppointment.Id }, responseDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating appointment", error = ex.Message });
            }
        }

        [HttpPatch("{appointmentId}")]
        public async Task<IActionResult> UpdateAppointmentStatus(string appointmentId, [FromBody] UpdateAppointmentStatusDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
                if (appointment == null)
                {
                    return NotFound(new { message = "Appointment not found" });
                }

                appointment.Status = request.Status;
                await _appointmentRepository.UpdateAsync(appointment);

                var updatedAppointment = await _appointmentRepository.GetAppointmentDetailsAsync(appointmentId); // Get full details for response
                var responseDto = new AppointmentDto
                {
                    Id = updatedAppointment.Id,
                    Date = updatedAppointment.Date.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    Doctor = new AppointmentDoctorInfoDto
                    {
                        Id = updatedAppointment.Doctor.Id,
                        Name = updatedAppointment.Doctor.Name,
                        Specialty = updatedAppointment.Doctor.DoctorProfile?.Specialty ?? "N/A"
                    },
                    PatientId = updatedAppointment.PatientId,
                    PatientName = updatedAppointment.Patient.Name,
                    Symptoms = updatedAppointment.Symptoms,
                    Notes = updatedAppointment.Notes,
                    Prescription = updatedAppointment.Prescription?.Select(m => new MedicationDto
                    {
                        Id = m.Id,
                        Name = m.Name,
                        Dosage = m.Dosage,
                        Frequency = m.Frequency,
                        Duration = m.Duration
                    }).ToList(),
                    Status = updatedAppointment.Status.ToString().ToLower(),
                    Cost = updatedAppointment.Cost,
                    PatientReview = updatedAppointment.PatientReview != null ? new PatientReviewInputDto
                    {
                        Rating = updatedAppointment.PatientReview.Rating,
                        Comment = updatedAppointment.PatientReview.Comment
                    } : null,
                    OutcomeStatus = updatedAppointment.OutcomeStatus?.ToString().ToLower()
                };

                return Ok(responseDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating appointment", error = ex.Message });
            }
        }

        [HttpPatch("{appointmentId}/outcome")]
        public async Task<IActionResult> RecordAppointmentOutcome(string appointmentId, [FromBody] UpdateAppointmentOutcomeDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var appointment = await _appointmentRepository.GetAppointmentDetailsAsync(appointmentId);
                if (appointment == null)
                {
                    return NotFound(new { message = "Appointment not found" });
                }

                appointment.OutcomeStatus = request.OutcomeStatus;
                appointment.Notes = request.Notes;

                // Clear existing prescription for this appointment and add new ones
                if (appointment.Prescription != null && appointment.Prescription.Any())
                {
                    foreach (var med in appointment.Prescription.ToList()) // ToList to avoid modifying collection while iterating
                    {
                        await _medicationRepository.DeleteAsync(med);
                    }
                }
                appointment.Prescription.Clear(); // Clear in memory collection

                if (request.Prescription != null && request.Prescription.Any())
                {
                    foreach (var medDto in request.Prescription)
                    {
                        var newMed = new Medication
                        {
                            Id = Guid.NewGuid().ToString(),
                            AppointmentId = appointmentId,
                            Name = medDto.Name,
                            Dosage = medDto.Dosage,
                            Frequency = medDto.Frequency,
                            Duration = medDto.Duration
                        };
                        appointment.Prescription.Add(newMed);
                    }
                }

                // Update appointment
                await _appointmentRepository.UpdateAsync(appointment);

                var updatedAppointment = await _appointmentRepository.GetAppointmentDetailsAsync(appointmentId);
                var responseDto = new AppointmentDto
                {
                    Id = updatedAppointment.Id,
                    Date = updatedAppointment.Date.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    Doctor = new AppointmentDoctorInfoDto
                    {
                        Id = updatedAppointment.Doctor.Id,
                        Name = updatedAppointment.Doctor.Name,
                        Specialty = updatedAppointment.Doctor.DoctorProfile?.Specialty ?? "N/A"
                    },
                    PatientId = updatedAppointment.PatientId,
                    PatientName = updatedAppointment.Patient.Name,
                    Symptoms = updatedAppointment.Symptoms,
                    Notes = updatedAppointment.Notes,
                    Prescription = updatedAppointment.Prescription?.Select(m => new MedicationDto
                    {
                        Id = m.Id,
                        Name = m.Name,
                        Dosage = m.Dosage,
                        Frequency = m.Frequency,
                        Duration = m.Duration
                    }).ToList(),
                    Status = updatedAppointment.Status.ToString().ToLower(),
                    Cost = updatedAppointment.Cost,
                    PatientReview = updatedAppointment.PatientReview != null ? new PatientReviewInputDto
                    {
                        Rating = updatedAppointment.PatientReview.Rating,
                        Comment = updatedAppointment.PatientReview.Comment
                    } : null,
                    OutcomeStatus = updatedAppointment.OutcomeStatus?.ToString().ToLower()
                };

                return Ok(responseDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error recording outcome", error = ex.Message });
            }
        }

        [HttpPost("{appointmentId}/review")]
        public async Task<IActionResult> SubmitAppointmentReview(string appointmentId, [FromBody] PatientReviewInputDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
                if (appointment == null)
                {
                    return NotFound(new { message = "Appointment not found" });
                }

                if (appointment.Status != AppointmentStatus.Completed)
                {
                    return BadRequest(new { message = "Cannot review an appointment that is not completed." });
                }

                if (appointment.PatientReview != null)
                {
                    return BadRequest(new { message = "Appointment already has a review. Use PATCH to update." });
                }

                var newReview = new AppointmentPatientReview
                {
                    Id = Guid.NewGuid().ToString(),
                    AppointmentId = appointmentId,
                    Rating = request.Rating,
                    Comment = request.Comment
                };

                await _patientReviewRepository.AddAsync(newReview);

                // Update the navigation property in the appointment object
                appointment.PatientReview = newReview;
                await _appointmentRepository.UpdateAsync(appointment);

                var updatedAppointment = await _appointmentRepository.GetAppointmentDetailsAsync(appointmentId);
                var responseDto = new AppointmentDto
                {
                    Id = updatedAppointment.Id,
                    Date = updatedAppointment.Date.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    Doctor = new AppointmentDoctorInfoDto
                    {
                        Id = updatedAppointment.Doctor.Id,
                        Name = updatedAppointment.Doctor.Name,
                        Specialty = updatedAppointment.Doctor.DoctorProfile?.Specialty ?? "N/A"
                    },
                    PatientId = updatedAppointment.PatientId,
                    PatientName = updatedAppointment.Patient.Name,
                    Symptoms = updatedAppointment.Symptoms,
                    Notes = updatedAppointment.Notes,
                    Prescription = updatedAppointment.Prescription?.Select(m => new MedicationDto
                    {
                        Id = m.Id,
                        Name = m.Name,
                        Dosage = m.Dosage,
                        Frequency = m.Frequency,
                        Duration = m.Duration
                    }).ToList(),
                    Status = updatedAppointment.Status.ToString().ToLower(),
                    Cost = updatedAppointment.Cost,
                    PatientReview = updatedAppointment.PatientReview != null ? new PatientReviewInputDto
                    {
                        Rating = updatedAppointment.PatientReview.Rating,
                        Comment = updatedAppointment.PatientReview.Comment
                    } : null,
                    OutcomeStatus = updatedAppointment.OutcomeStatus?.ToString().ToLower()
                };

                return CreatedAtAction(nameof(GetAppointments), new { id = updatedAppointment.Id }, responseDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error submitting review", error = ex.Message });
            }
        }

        [HttpPatch("{appointmentId}/review")]
        public async Task<IActionResult> UpdateAppointmentReview(string appointmentId, [FromBody] PatientReviewInputDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var appointment = await _appointmentRepository.GetAppointmentDetailsAsync(appointmentId);
                if (appointment == null)
                {
                    return NotFound(new { message = "Appointment not found" });
                }

                if (appointment.Status != AppointmentStatus.Completed)
                {
                    return BadRequest(new { message = "Cannot review an appointment that is not completed." });
                }

                if (appointment.PatientReview == null)
                {
                    return NotFound(new { message = "No existing review to update. Use POST to create." });
                }

                appointment.PatientReview.Rating = request.Rating;
                appointment.PatientReview.Comment = request.Comment;

                await _patientReviewRepository.UpdateAsync(appointment.PatientReview);
                await _appointmentRepository.UpdateAsync(appointment); // Update parent to trigger save changes

                var updatedAppointment = await _appointmentRepository.GetAppointmentDetailsAsync(appointmentId);
                var responseDto = new AppointmentDto
                {
                    Id = updatedAppointment.Id,
                    Date = updatedAppointment.Date.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    Doctor = new AppointmentDoctorInfoDto
                    {
                        Id = updatedAppointment.Doctor.Id,
                        Name = updatedAppointment.Doctor.Name,
                        Specialty = updatedAppointment.Doctor.DoctorProfile?.Specialty ?? "N/A"
                    },
                    PatientId = updatedAppointment.PatientId,
                    PatientName = updatedAppointment.Patient.Name,
                    Symptoms = updatedAppointment.Symptoms,
                    Notes = updatedAppointment.Notes,
                    Prescription = updatedAppointment.Prescription?.Select(m => new MedicationDto
                    {
                        Id = m.Id,
                        Name = m.Name,
                        Dosage = m.Dosage,
                        Frequency = m.Frequency,
                        Duration = m.Duration
                    }).ToList(),
                    Status = updatedAppointment.Status.ToString().ToLower(),
                    Cost = updatedAppointment.Cost,
                    PatientReview = updatedAppointment.PatientReview != null ? new PatientReviewInputDto
                    {
                        Rating = updatedAppointment.PatientReview.Rating,
                        Comment = updatedAppointment.PatientReview.Comment
                    } : null,
                    OutcomeStatus = updatedAppointment.OutcomeStatus?.ToString().ToLower()
                };

                return Ok(responseDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating review", error = ex.Message });
            }
        }

        [HttpDelete("{appointmentId}")]
        public async Task<IActionResult> DeleteAppointment(string appointmentId)
        {
            try
            {
                var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
                if (appointment == null)
                {
                    return NotFound(new { message = "Appointment not found" });
                }

                // Remove associated prescription medications
                if (appointment.Prescription != null && appointment.Prescription.Any())
                {
                    foreach (var med in appointment.Prescription.ToList()) // ToList to avoid modifying collection while iterating
                    {
                        await _medicationRepository.DeleteAsync(med);
                    }
                }

                // Remove patient review if exists
                if (appointment.PatientReview != null)
                {
                    await _patientReviewRepository.DeleteAsync(appointment.PatientReview);
                }

                await _appointmentRepository.DeleteAsync(appointment);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting appointment", error = ex.Message });
            }
        }
        [HttpGet("{appointmentId}")]
        public async Task<IActionResult> GetAppointmentById(string appointmentId)
        {
            try
            {
                var appointment = await _appointmentRepository.GetAppointmentDetailsAsync(appointmentId);
                if (appointment == null)
                {
                    return NotFound(new { message = "Appointment not found" });
                }

                var responseDto = new AppointmentDto
                {
                    Id = appointment.Id,
                    Date = appointment.Date.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    Doctor = new AppointmentDoctorInfoDto
                    {
                        Id = appointment.Doctor.Id,
                        Name = appointment.Doctor.Name,
                        Specialty = appointment.Doctor.DoctorProfile?.Specialty ?? "N/A"
                    },
                    PatientId = appointment.PatientId,
                    PatientName = appointment.Patient.Name,
                    Symptoms = appointment.Symptoms,
                    Notes = appointment.Notes,
                    Prescription = appointment.Prescription?.Select(m => new MedicationDto
                    {
                        Id = m.Id,
                        Name = m.Name,
                        Dosage = m.Dosage,
                        Frequency = m.Frequency,
                        Duration = m.Duration
                    }).ToList(),
                    Status = appointment.Status.ToString().ToLower(),
                    Cost = appointment.Cost,
                    PatientReview = appointment.PatientReview != null ? new PatientReviewInputDto
                    {
                        Rating = appointment.PatientReview.Rating,
                        Comment = appointment.PatientReview.Comment
                    } : null,
                    OutcomeStatus = appointment.OutcomeStatus?.ToString().ToLower()
                };

                return Ok(responseDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching appointment", error = ex.Message });
            }
        }
    }
}