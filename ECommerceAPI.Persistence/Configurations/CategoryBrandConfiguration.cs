using ECommerceAPI.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerceAPI.Persistence.Configurations
{
    internal class CategoryBrandConfiguration : IEntityTypeConfiguration<CategoryBrand>
    {
        public void Configure(EntityTypeBuilder<CategoryBrand> builder)
        {
            builder.HasKey(cb => new { cb.CategoryId, cb.BrandId });

            builder.HasOne(cb => cb.Category)
                   .WithMany(c => c.CategoryBrands)
                   .HasForeignKey(cb => cb.CategoryId);

            builder.HasOne(cb => cb.Brand)
                   .WithMany(b => b.CategoryBrands)
                   .HasForeignKey(cb => cb.BrandId);

            builder.ToTable("CategoryBrands");
        }
    }
}
