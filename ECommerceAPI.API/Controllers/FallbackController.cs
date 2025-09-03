using Microsoft.AspNetCore.Mvc;

public class FallbackController : Controller
{
    public IActionResult Index()
    {
        string filePath = Path.Combine(Directory.GetCurrentDirectory(), "browser", "index.csr.html");

        // Debug için
        System.IO.File.AppendAllText(Path.Combine(Directory.GetCurrentDirectory(), "log.txt"),
            $"Looking for file at: {filePath}, Exists: {System.IO.File.Exists(filePath)}\n");

        if (System.IO.File.Exists(filePath))
        {
            return PhysicalFile(filePath, "text/html");
        }

        // Alternatif yol deneyin
        filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "browser", "index.csr.html");

        if (System.IO.File.Exists(filePath))
        {
            return PhysicalFile(filePath, "text/html");
        }

        return NotFound($"File not found. Searched at: {filePath}");
    }
}