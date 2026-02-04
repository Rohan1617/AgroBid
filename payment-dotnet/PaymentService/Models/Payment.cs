using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentService.Models
{
    [Table("payments")]
    public class Payment
    {
        [Key]
        [Column("payment_id")]
        public long PaymentId { get; set; }

        [Column("sale_id")]
        public long SaleId { get; set; }

        [Column("amount")]
        public double Amount { get; set; }

        [Column("status")]
        public string Status { get; set; }

        [Column("gateway_order_id")]
        public string GatewayOrderId { get; set; }

        [Column("gateway_payment_id")]
        public string GatewayPaymentId { get; set; }

        [Column("gateway_signature")] // Added for completeness, usually mapped
        public string? GatewaySignature { get; set; } // Matches Java entity

        [Column("paid_at")]
        public DateTime? PaidAt { get; set; }
    }
}