using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using product;

namespace InventorySystem.Controllers  
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly string connectionString = "Server=localhost;Database=InventoryDB;User=root;Password=Leil@123456;";

        // GET: api/Product
        [HttpGet]
        public IActionResult GetAllProducts()
        {
            var products = new List<Product>();
            using (var connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                string query = "SELECT * FROM Products";
                using (var command = new MySqlCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            // Updated to use the constructor with required parameters
                            var product = new Product(
                                reader.GetString("Name"),
                                reader.GetString("Category"),
                                reader.GetInt32("Quantity"),
                                reader.GetDateTime("ExpirationDate")
                            )
                            {
                                ProductID = reader.GetInt32("ProductID") // Set additional properties if needed
                            };
                            products.Add(product);
                        }
                    }
                }
            }

            return Ok(products);
        }
    }
}

