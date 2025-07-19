using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Domain.Entities
{
    public class Address : BaseEntity
    {
        public required string Line1 { get; set; }
        public  string? Line2 { get; set; }
        public required string City { get; set; }
        public required string State { get; set; }
        public required string Country { get; set; }
        public string PostalCode { get; set; }



    }
}
