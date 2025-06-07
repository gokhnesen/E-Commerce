namespace ECommerceAPI.Application.Features.Products.Queries.GetList
{
    public class GetListProductQueryResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string CategoryName { get; set; }
    }
} 