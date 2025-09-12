using ECommerceAPI.Application.Extensions;
using ECommerceAPI.Application.Features.Products.Commands.Create;
using ECommerceAPI.Application.Features.Products.Commands.Delete;
using ECommerceAPI.Application.Features.Products.Commands.Update;
using ECommerceAPI.Application.Features.Products.ProductSpecs;
using ECommerceAPI.Application.Features.Products.Queries.GetById;
using ECommerceAPI.Application.Features.Products.Queries.GetList;
using ECommerceAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Png; // or Jpeg

namespace ECommerceAPI.API.Controllers
{
    public class ProductController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetList([FromQuery]ProductSpecParams? specParams)
        {

            var query = new GetListProductQuery(specParams);
            var response = await Mediator.Send(query);
            return Ok(response);
        }

        [HttpGet("{id}")]

        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var query = new GetByIdProductQuery { Id = id };
            var response = await Mediator.Send(query);
            return Ok(response);
        }

        [InvalidateCache("api/product|")]
        [Authorize(Roles = "Admin")]
        [HttpPost("add")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductCommand createProductCommand)
        {
            CreateProductResponse response = await Mediator.Send(createProductCommand);
            return Ok(response);
        }

        [InvalidateCache("api/product|")]

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct([FromRoute] Guid id)
        {
            DeleteProductResponse response = await Mediator.Send(new DeleteProductCommand { Id = id });
            return Ok(response);
        }

        [InvalidateCache("api/product|")]
        [HttpPut]
        public async Task<IActionResult> UpdateProduct([FromBody] UpdateProductCommand updateProductCommand)
        {
            UpdateProductResponse response = await Mediator.Send(updateProductCommand);
            return Ok(response);
        }


        [Authorize(Roles = "Admin")]
        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage([FromForm] UploadImageDto dto)
        {
            var image = dto.Image;
            if (image == null || image.Length == 0)
                return BadRequest("Resim dosyası seçilmedi.");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

      
            using (var inputStream = image.OpenReadStream())
            using (var img = await Image.LoadAsync(inputStream))
            {
                img.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new Size(800, 800),
                    Mode = ResizeMode.Crop
                }));

                await img.SaveAsync(filePath); 
            }

            var imageUrl = $"{Request.Scheme}://{Request.Host}/images/products/{fileName}";
            return Ok(new { pictureUrl = imageUrl });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("update-image/{id}")]
        public async Task<IActionResult> UpdateImage([FromRoute] Guid id, [FromForm] UploadImageDto dto)
        {
            var image = dto.Image;
            if (image == null || image.Length == 0)
                return BadRequest("Resim dosyası seçilmedi.");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var imageUrl = $"{Request.Scheme}://{Request.Host}/images/products/{fileName}";

            
            var updateCommand = new UpdateProductCommand
            {
                Id = id,
                PictureUrl = imageUrl
            };
            var response = await Mediator.Send(updateCommand);

            return Ok(new { pictureUrl = imageUrl, product = response });
        }
    }
}
