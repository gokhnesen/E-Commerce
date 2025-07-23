using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceAPI.Application.Features.DeliveryMethod.Configurations
{
    public class DeliveryMethodConfigurations : IEntityTypeConfiguration<Domain.Entities.DeliveryMethod>
    {
        public void Configure(EntityTypeBuilder<Domain.Entities.DeliveryMethod> builder)
        {
            //builder.Property(x => x.Price).HasColumnType("decimal(18,2)");
        }
    }
}
