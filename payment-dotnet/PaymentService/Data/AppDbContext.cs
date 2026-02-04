using Microsoft.EntityFrameworkCore;
using PaymentService.Models;

namespace PaymentService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Payment> Payments { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<Crop> Crops { get; set; } // ➕ ADDED


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ⚡ Explicit Mapping to avoid Case Sensitivity Issues
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.ToTable("payments");
                entity.Property(e => e.PaymentId).HasColumnName("payment_id");
                entity.Property(e => e.SaleId).HasColumnName("sale_id");
                entity.Property(e => e.Amount).HasColumnName("amount");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.GatewayOrderId).HasColumnName("gateway_order_id");
                entity.Property(e => e.GatewayPaymentId).HasColumnName("gateway_payment_id");
                entity.Property(e => e.GatewaySignature).HasColumnName("gateway_signature");
                entity.Property(e => e.PaidAt).HasColumnName("paid_at");
            });

            modelBuilder.Entity<Sale>(entity =>
            {
                entity.ToTable("sales");
                entity.Property(e => e.SaleId).HasColumnName("sale_id");
                entity.Property(e => e.VendorId).HasColumnName("vendor_id");
                entity.Property(e => e.CropId).HasColumnName("crop_id"); // ➕
                entity.Property(e => e.Status).HasColumnName("status");
            });

            modelBuilder.Entity<Crop>(entity =>
            {
                entity.ToTable("crops");
                entity.Property(e => e.CropId).HasColumnName("crop_id");
                entity.Property(e => e.Status).HasColumnName("status");
            });
        }
    }
}