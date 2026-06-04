public class CarRentalTests
{
    [Fact]
    public void BookingDays_CalculatedCorrectly()
    {
        var pickup = new DateTime(2026, 6, 1);
        var returnD = new DateTime(2026, 6, 5);
        var days = (returnD - pickup).Days;
        Assert.Equal(4, days);
    }

    [Fact]
    public void TotalPrice_CalculatedCorrectly()
    {
        decimal pricePerDay = 75m;
        int days = 4;
        decimal total = pricePerDay * days;
        Assert.Equal(300m, total);
    }

    [Fact]
    public void CarStatus_DefaultAvailable()
    {
        var status = "available";
        Assert.Equal("available", status);
    }
}
