using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace OMAB.Application.Cores;

public class LoggingBehavior<TRequest, TResponse>(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;

        logger.LogInformation("GlobalLogger: Processing Request {RequestName}", requestName);

        var timer = Stopwatch.StartNew();

        try
        {
            var response = await next();

            timer.Stop();

            if (timer.ElapsedMilliseconds > 5000)
            {
                logger.LogWarning("GlobalLogger: Request {RequestName} took too long ({Elapsed}ms)",
                    requestName, timer.ElapsedMilliseconds);
            }
            else
            {
                logger.LogInformation("GlobalLogger: Processed Request {RequestName} successfully in {Elapsed}ms",
                    requestName, timer.ElapsedMilliseconds);
            }

            return response;
        }
        catch (Exception)
        {
            logger.LogError("GlobalLogger: Request {RequestName} failed", requestName);
            throw;
        }
    }
}