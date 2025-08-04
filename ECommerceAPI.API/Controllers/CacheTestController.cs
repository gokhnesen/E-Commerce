using ECommerceAPI.Application.Extensions;
using ECommerceAPI.Application.Interfaces.Cache;
using ECommerceAPI.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.API.Controllers
{
    public class CacheTestController : BaseController
    {
        private readonly IResponseCacheService _cacheService;

        public CacheTestController(IResponseCacheService cacheService)
        {
            _cacheService = cacheService;
        }

        // Cache test endpoint - her ça?r?da farkl? timestamp döner, cache varsa ayn? de?eri döner
        [Cache(30)] // 30 saniye cache
        [HttpGet("time-test")]
        public async Task<IActionResult> TimeTest()
        {
            return Ok(new { 
                message = "Bu endpoint 30 saniye cache'lenir", 
                timestamp = DateTime.Now,
                randomValue = new Random().Next(1000, 9999),
                instructions = "Bu endpoint'i art arda ça??r?n, 30 saniye boyunca ayn? timestamp ve randomValue dönecek"
            });
        }

        // Cache durumunu kontrol et
        [HttpGet("status")]
        public async Task<IActionResult> CacheStatus()
        {
            var testKeys = new[] { 
                "/api/cachetest/time-test",
                "/api/product",
                "/api/product/cache-test"
            };

            var results = new List<object>();
            
            foreach (var key in testKeys)
            {
                var cachedData = await _cacheService.GetCachedResponseAsync(key);
                results.Add(new { 
                    key = key,
                    exists = !string.IsNullOrEmpty(cachedData),
                    dataLength = cachedData?.Length ?? 0,
                    preview = cachedData?.Length > 50 ? cachedData.Substring(0, 50) + "..." : cachedData
                });
            }

            return Ok(new { 
                message = "Cache status check",
                results = results,
                timestamp = DateTime.Now,
                instructions = new
                {
                    step1 = "1. GET /api/cachetest/time-test ça??r?n (cache'e kaydedilir)",
                    step2 = "2. Ayn? endpoint'i tekrar ça??r?n (cache'den döner)",
                    step3 = "3. GET /api/cachetest/status ile cache durumunu kontrol edin",
                    step4 = "4. POST /api/cachetest/clear-cache ile cache'i temizleyin"
                }
            });
        }

        // Cache temizleme
        [HttpPost("clear-cache")]
        public async Task<IActionResult> ClearCache([FromQuery] string pattern = "*")
        {
            await _cacheService.RemoveCacheByPattern(pattern);
            return Ok(new { 
                message = $"Cache cleared for pattern: {pattern}",
                timestamp = DateTime.Now
            });
        }

        // Manual cache test
        [HttpPost("manual-cache")]
        public async Task<IActionResult> ManualCacheTest([FromBody] object data)
        {
            string cacheKey = "manual-test-key";
            await _cacheService.CacheResponseAsync(cacheKey, data, TimeSpan.FromMinutes(5));
            return Ok(new { 
                message = "Data cached successfully", 
                cacheKey = cacheKey,
                ttl = "5 minutes"
            });
        }

        [HttpGet("manual-cache")]
        public async Task<IActionResult> GetManualCache()
        {
            string cacheKey = "manual-test-key";
            var cachedData = await _cacheService.GetCachedResponseAsync(cacheKey);
            
            return Ok(new { 
                cacheKey = cacheKey,
                exists = !string.IsNullOrEmpty(cachedData),
                data = cachedData
            });
        }
    }
}