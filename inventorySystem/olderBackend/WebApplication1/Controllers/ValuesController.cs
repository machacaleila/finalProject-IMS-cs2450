
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        // Inject InventoryService into the controller
        public ProductController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        // GET: api/Product
        [HttpGet]
        public IActionResult GetAllProducts()
        {
            var products = _inventoryService.GetAllProducts();
            return Ok(products);
        }

        // POST: api/Product
        [HttpPost]
        public IActionResult AddProduct([FromBody] Product newProduct)
        {
            _inventoryService.AddProduct(newProduct);
            return CreatedAtAction(nameof(GetAllProducts), new { id = newProduct.ProductID }, newProduct);
        }

        // DELETE: api/Product/5
        [HttpDelete("{id}")]
        public IActionResult RemoveProduct(int id)
        {
            _inventoryService.RemoveProduct(id);
            return NoContent();
        }

        // GET: api/Product/CheckThreshold
        [HttpGet("CheckThreshold")]
        public IActionResult CheckThreshold([FromQuery] int threshold)
        {
            _inventoryService.CheckThreshold(threshold);
            return Ok("Threshold check completed.");
        }
    }


}
