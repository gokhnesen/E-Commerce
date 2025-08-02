using ECommerceAPI.Application.Interfaces;
using ECommerceAPI.Application.Specification;
using ECommerceAPI.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        private IMediator? _mediator;
        protected IMediator? Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected async Task<ActionResult> CreatePagedResult<T>(IReadRepository<T> readRepositoy, IWriteRepository<T> writeRepository,
            ISpecification<T> spec, int pageIndex, int pageSize) where T: BaseEntity
        {
            var items = await readRepositoy.ListAsync(spec);
            var count = await readRepositoy.CountAsync(spec);
            var pagination = new Pagination<T>(pageIndex, pageSize, count, items);

            return Ok(pagination);
        }


    }
}
