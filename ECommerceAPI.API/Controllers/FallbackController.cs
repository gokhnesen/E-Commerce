using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.API.Controllers
{
    public class FallbackController : Controller
    {
        public IActionResult Index()
        {
            // Azure ortamında mıyız kontrol et
            bool isAzure = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("WEBSITE_SITE_NAME"));

            string filePath;
            if (isAzure)
            {
                // Azure'da - wwwroot ekleme
                filePath = Path.Combine(Directory.GetCurrentDirectory(), "browser", "index.csr.html");

                if (!System.IO.File.Exists(filePath))
                {
                    // Eğer bulamazsa, farklı konumları dene
                    var paths = new[]
                    {
                Path.Combine(Directory.GetCurrentDirectory(), "index.csr.html"),
                Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "browser", "index.csr.html")
            };

                    foreach (var path in paths)
                    {
                        if (System.IO.File.Exists(path))
                        {
                            filePath = path;
                            break;
                        }
                    }
                }
            }
            else
            {
                // Yerel geliştirme ortamında
                filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "browser", "index.csr.html");
            }

            if (System.IO.File.Exists(filePath))
            {
                return PhysicalFile(filePath, "text/HTML");
            }

            // Hata ayıklama için
            var currentDirectory = Directory.GetCurrentDirectory();
            var files = Directory.Exists(currentDirectory)
                ? Directory.GetFiles(currentDirectory).Select(Path.GetFileName)
                : new string[] { "Dizin bulunamadı" };

            var dirs = Directory.Exists(currentDirectory)
                ? Directory.GetDirectories(currentDirectory).Select(Path.GetFileName)
                : new string[] { "Dizin bulunamadı" };

            return Content($"Dosya bulunamadı: {filePath}\n" +
                          $"Mevcut dizin: {currentDirectory}\n" +
                          $"Klasörler: {string.Join(", ", dirs)}\n" +
                          $"Dosyalar: {string.Join(", ", files)}");
        }
    }
}