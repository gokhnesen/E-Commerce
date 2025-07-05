using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Domain.Entities
{
    public class Cart : BaseEntity
    {
        public List<CartItem> Items { get; set; }
    }
}
