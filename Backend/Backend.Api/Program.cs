using Microsoft.EntityFrameworkCore;
using Backend.Infrastructure.Data;
using Backend.Core.Interfaces;
using Backend.Infrastructure.Repositories;
using Backend.Core.Services;
using Backend.Api.Middleware; // For custom error handling middleware
using Microsoft.OpenApi.Models; // For Swagger

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure SQLite DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)));

// Register Repositories
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();
builder.Services.AddScoped<IRelativeRepository, RelativeRepository>();
builder.Services.AddScoped<IUserNotificationRepository, UserNotificationRepository>();

// Register Services
builder.Services.AddScoped<AuthService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
             .AllowAnyHeader()
             .AllowAnyMethod();
    });
});
var app = builder.Build();
app.UseCors("AllowReactApp");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        dbContext.Database.Migrate();
    }
}
else
{
    app.UseErrorHandlingMiddleware();
}

// app.UseHttpsRedirection();

// No app.UseAuthentication() and app.UseAuthorization() needed for no-auth setup
app.MapControllers();

app.Run();