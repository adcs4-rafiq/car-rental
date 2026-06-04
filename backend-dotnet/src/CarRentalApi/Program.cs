using StackExchange.Redis;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var redisHost = Environment.GetEnvironmentVariable("REDIS_HOST") ?? "localhost";
var redis = ConnectionMultiplexer.Connect(redisHost);
builder.Services.AddSingleton<IConnectionMultiplexer>(redis);

var app = builder.Build();
app.UseCors("AllowAll");

// --- Seed cars ---
var cars = new List<Car>
{
    new(1, "Toyota Camry",    "Sedan",  55,  "Automatic", 5, "available", "/cars/camry.jpg"),
    new(2, "Honda CR-V",      "SUV",    75,  "Automatic", 5, "available", "/cars/crv.jpg"),
    new(3, "BMW 3 Series",    "Luxury", 120, "Automatic", 5, "available", "/cars/bmw3.jpg"),
    new(4, "Ford Mustang",    "Sports", 110, "Manual",    4, "available", "/cars/mustang.jpg"),
    new(5, "Toyota Hiace",    "Van",    90,  "Manual",    12,"available", "/cars/hiace.jpg"),
    new(6, "Mercedes C-Class","Luxury", 140, "Automatic", 5, "available", "/cars/mercedes.jpg"),
};

var bookings = new List<Booking>();
var bookingIdCounter = 1;

// --- CARS ---
app.MapGet("/api/status", () => new {
    status = "ok",
    message = "DriveEasy Car Rental API v1.0",
    time = DateTime.UtcNow
});

app.MapGet("/api/cars", () => cars);

app.MapGet("/api/cars/{id:int}", (int id) =>
{
    var car = cars.FirstOrDefault(c => c.Id == id);
    return car is null ? Results.NotFound(new { error = "Car not found" }) : Results.Ok(car);
});

app.MapGet("/api/cars/available", () => cars.Where(c => c.Status == "available").ToList());

// --- BOOKINGS ---
app.MapGet("/api/bookings", () => bookings.OrderByDescending(b => b.CreatedAt).ToList());

app.MapPost("/api/bookings", async (BookingRequest req, IConnectionMultiplexer mux) =>
{
    var car = cars.FirstOrDefault(c => c.Id == req.CarId);
    if (car is null) return Results.BadRequest(new { error = "Car not found" });
    if (car.Status != "available") return Results.BadRequest(new { error = "Car is not available" });

    var days = (req.ReturnDate - req.PickupDate).Days;
    if (days <= 0) return Results.BadRequest(new { error = "Return date must be after pickup date" });

    var total = days * car.PricePerDay;
    var booking = new Booking(
        bookingIdCounter++, car.Id, car.Name, car.Category,
        req.CustomerName, req.CustomerEmail, req.CustomerPhone,
        req.PickupDate, req.ReturnDate, days, total, "confirmed",
        DateTime.UtcNow
    );

    bookings.Add(booking);
    car.Status = "booked";

    // Push to Redis for worker to process
    var db = mux.GetDatabase();
    var payload = JsonSerializer.Serialize(new {
        booking_id = booking.Id,
        customer = booking.CustomerName,
        email = booking.CustomerEmail,
        car = booking.CarName,
        pickup = booking.PickupDate.ToString("yyyy-MM-dd"),
        returnDate = booking.ReturnDate.ToString("yyyy-MM-dd"),
        total = booking.TotalPrice
    });
    await db.ListRightPushAsync("bookings:pending", payload);

    return Results.Created($"/api/bookings/{booking.Id}", booking);
});

app.MapDelete("/api/bookings/{id:int}", (int id) =>
{
    var booking = bookings.FirstOrDefault(b => b.Id == id);
    if (booking is null) return Results.NotFound(new { error = "Booking not found" });

    var car = cars.FirstOrDefault(c => c.Id == booking.CarId);
    if (car is not null) car.Status = "available";

    bookings.Remove(booking);
    return Results.Ok(new { message = "Booking cancelled successfully" });
});

// --- WORKER STATUS ---
app.MapGet("/api/worker/status", async (IConnectionMultiplexer mux) =>
{
    var db = mux.GetDatabase();
    var processed = await db.StringGetAsync("worker:processed_count");
    var lastJob   = await db.StringGetAsync("worker:last_job");
    var logs      = await db.ListRangeAsync("worker:logs", 0, 9);
    return new {
        processed_count = processed.HasValue ? (string)processed! : "0",
        last_job        = lastJob.HasValue   ? (string)lastJob!   : "none",
        recent_logs     = logs.Select(l => (string)l!).ToArray()
    };
});

app.Run();

record Car(int Id, string Name, string Category, decimal PricePerDay,
           string Transmission, int Seats, string Status, string Image)
{
    public string Status { get; set; } = Status;
}

record Booking(int Id, int CarId, string CarName, string Category,
               string CustomerName, string CustomerEmail, string CustomerPhone,
               DateTime PickupDate, DateTime ReturnDate, int Days,
               decimal TotalPrice, string Status, DateTime CreatedAt);

record BookingRequest(int CarId, string CustomerName, string CustomerEmail,
                      string CustomerPhone, DateTime PickupDate, DateTime ReturnDate);
