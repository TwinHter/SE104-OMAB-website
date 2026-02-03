using MediatR;
using Microsoft.AspNetCore.Mvc;
using OMAB.Application.Cores; // Namespace chứa Result<T>

namespace OMAB.API.Controllers; // Hoặc namespace WebAPI của bạn

[ApiController]
[Route("api/[controller]")]
public abstract class ApiController : ControllerBase
{
    private ISender? _sender;
    protected ISender Sender => _sender ??= HttpContext.RequestServices.GetRequiredService<ISender>();

    protected IActionResult HandleResult<T>(Result<T> result)
    {
        if (result.IsSuccess) return Ok(result.Value);

        var problemDetails = new ProblemDetails
        {
            Status = result.StatusCode,
            Title = GetTitleFromStatusCode(result.StatusCode),
            Detail = result.Error,
            Instance = HttpContext.Request.Path
        };

        return StatusCode(result.StatusCode, problemDetails);
    }

    private static string GetTitleFromStatusCode(int statusCode)
    {
        return statusCode switch
        {
            400 => "Bad Request",
            401 => "Unauthorized",
            403 => "Forbidden",
            404 => "Not Found",
            409 => "Conflict",
            500 => "Internal Server Error",
            _ => $"An Error Occurred, {statusCode}"
        };
    }
}