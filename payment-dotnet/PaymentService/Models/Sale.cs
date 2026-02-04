using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentService.Models
{
    [Table("sales")]
    public class Sale
    {
        [Key]
        [Column("sale_id")]
        public long SaleId { get; set; }

        [Column("vendor_id")]
        public long VendorId { get; set; }

        [Column("crop_id")]
        public long CropId { get; set; }

        [Column("status")]
        public string Status { get; set; }
    }
}
