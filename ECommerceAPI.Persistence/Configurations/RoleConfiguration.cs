using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Persistence.Configurations
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
    {
        public void Configure(EntityTypeBuilder<IdentityRole> builder)
        {
            builder.HasData(
                new IdentityRole { Id = "admin-id", Name = "Admin", NormalizedName = "ADMIN" },
                new IdentityRole { Id = "customer-id", Name = "Customer", NormalizedName = "CUSTOMER" },
                new IdentityRole { Id = "seller-id", Name = "Seller", NormalizedName = "SELLER" }


                );
        }
    }
}
