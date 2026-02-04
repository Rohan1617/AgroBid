using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentService.Models
{
    [Table("crops")]
    public class Crop
    {
        [Key]
        [Column("crop_id")]
        public long CropId { get; set; }

        [Column("status")]
        public string Status { get; set; }
    }
}
