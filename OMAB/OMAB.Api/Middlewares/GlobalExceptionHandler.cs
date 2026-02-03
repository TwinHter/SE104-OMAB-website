using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using FluentValidation; // Cần cái này để bắt lỗi Validation
using System.Diagnostics;

namespace OMAB.Api.Middleware;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        // 1. Log lỗi (Quan trọng để debug)
        logger.LogError(
            exception,
            "Exception occurred: {Message}. TraceId: {TraceId}",
            exception.Message,
            Activity.Current?.Id ?? httpContext.TraceIdentifier
        );

        // 2. Phân loại lỗi để trả về Status Code phù hợp
        (int statusCode, string title, object? extensions) = MapException(exception);

        // 3. Tạo object ProblemDetails (Chuẩn trả về lỗi của API)
        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = exception.Message, // Có thể ẩn đi nếu là lỗi 500 ở môi trường Product
            Type = exception.GetType().Name,
            Instance = httpContext.Request.Path
        };

        // Nếu có dữ liệu mở rộng (ví dụ danh sách lỗi validation), gán vào
        if (extensions != null)
        {
            problemDetails.Extensions.Add("errors", extensions);
        }

        // 4. Ghi response trả về Client
        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        // Trả về true để báo hiệu lỗi đã được xử lý xong
        return true;
    }

    // Hàm phụ trợ để mapping lỗi
    private static (int StatusCode, string Title, object? Extensions) MapException(Exception exception)
    {
        return exception switch
        {
            // Trường hợp 1: Lỗi Validation (từ Application Layer ném ra) -> Trả về 400
            ValidationException validationEx => (
                StatusCodes.Status400BadRequest,
                "Validation Failure",
                validationEx.Errors.Select(e => new { Field = e.PropertyName, Error = e.ErrorMessage }) // Lấy danh sách lỗi chi tiết
            ),

            // Trường hợp 2: Lỗi không tìm thấy -> Trả về 404
            KeyNotFoundException => (StatusCodes.Status404NotFound, "Resource Not Found", null),

            // Trường hợp 3: Lỗi xác thực -> Trả về 401
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Unauthorized", null),

            // Mặc định: Lỗi hệ thống -> Trả về 500
            _ => (StatusCodes.Status500InternalServerError, "Internal Server Error", null)
        };
    }
}