using Microsoft.AspNetCore.Mvc;
using OMAB.API.Controllers;
using OMAB.Application.Features.Appointments.Commands;
using OMAB.Application.Features.Appointments.Queries;

namespace OMAB.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReviewsController : ApiController
{
    [HttpPost()]
    public async Task<IActionResult> CreatReview([FromBody] CreateReview.Command command)
    {
        var result = await Sender.Send(command);
        return HandleResult(result);
    }

    [HttpPut("")]
    public async Task<IActionResult> UpdateReview([FromBody] UpdateReview.Command command)
    {
        var result = await Sender.Send(command);
        return HandleResult(result);
    }

    [HttpGet("doctor/{doctorId:int}")]
    public async Task<IActionResult> GetDoctorReviews([FromRoute] int doctorId)
    {
        var result = await Sender.Send(new GetReviewByDoctorId.Query(doctorId));
        return HandleResult(result);
    }
}

