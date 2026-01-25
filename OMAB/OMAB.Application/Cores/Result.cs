using System;
using System.Net;

namespace OMAB.Application.Cores;

public class Result<T>
{
    public bool IsSuccess { get; init; }
    public T Value { get; init; } = default!;
    public string? Error { get; init; } = null;
    public int StatusCode { get; init; } = 0;

    public static Result<T> Success(T value) => new Result<T>
    {
        IsSuccess = true,
        Value = value,
        StatusCode = (int)HttpStatusCode.OK
    };
    public static Result<T> Failure(string error, int statusCode) => new Result<T>
    {
        IsSuccess = false,
        Error = error,
        StatusCode = statusCode
    };
}
