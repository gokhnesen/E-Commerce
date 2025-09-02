using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.API.Controllers
{
    public class FallbackController : Controller
    {
        public IActionResult Index()
        {
            bool isAzure = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("WEBSITE_SITE_NAME"));

            string filePath;
            if (isAzure)
            {
                // Azure'da browser klasöründeki dosyaya yönlendir
                filePath = Path.Combine(Directory.GetCurrentDirectory(), "browser", "index.csr.html");
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

            // Dosya bulunamazsa
            return NotFound($"Dosya bulunamadı: {filePath}");
        }
    }
}