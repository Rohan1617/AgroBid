using Microsoft.AspNetCore.Mvc;
using PaymentService.Data;
using PaymentService.Models;
using System.Linq;

namespace PaymentService.Controllers
{
    [ApiController]
    [Route("payments")]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentController(AppDbContext context)
        {
            _context = context;
        }

        // ❌ CANCEL PAYMENT (Allows cancellation only if CREATED)
        [HttpPost("cancel/{saleId}")]
        public IActionResult CancelPayment(long saleId)
        {
            var payment = _context.Payments.FirstOrDefault(p => p.SaleId == saleId);
            
            // If payment exists, verify status
            if (payment != null) 
            {
                if (payment.Status == "PAID" || payment.Status == "SUCCESS")
                {
                    return BadRequest("Cannot cancel a PAID payment. Request refund instead.");
                }
                payment.Status = "CANCELLED";
            }

            // Update Sale Status regardless of payment existence
            var sale = _context.Sales.FirstOrDefault(s => s.SaleId == saleId);
            
            if (sale == null)
            {
                // If neither payment nor sale found
                if (payment == null) 
                    return NotFound("Sale/Payment record not found");
            }
            else 
            {
                sale.Status = "CANCELLED";

                // 🔥 REVERT CROP STATUS
                var crop = _context.Crops.FirstOrDefault(c => c.CropId == sale.CropId);
                if (crop != null)
                {
                    crop.Status = "ACTIVE";
                }
            }

            _context.SaveChanges();

            return Ok("Sale cancelled successfully");
        }

        // 🔁 REFUND PAYMENT
        [HttpPost("refund/{paymentId}")]
        public IActionResult RefundPayment(long paymentId)
        {
            var payment = _context.Payments.Find(paymentId);

            if (payment == null) return NotFound("Payment not found");
            
            // Allow both "PAID" (Legacy/Standard) and "SUCCESS" (Razorpay Convention)
            if (payment.Status != "PAID" && payment.Status != "SUCCESS") 
                return BadRequest("Only PAID/SUCCESS payments can be refunded");

            payment.Status = "REFUNDED";

            // Update Sale Status
            var sale = _context.Sales.FirstOrDefault(s => s.SaleId == payment.SaleId);
            if (sale != null)
            {
                sale.Status = "REFUNDED";
                
                // 🔥 REVERT CROP STATUS
                var crop = _context.Crops.FirstOrDefault(c => c.CropId == sale.CropId);
                if (crop != null)
                {
                    crop.Status = "ACTIVE";
                }
            }

            _context.SaveChanges();

            return Ok("Refund successful");
        }


    }
}