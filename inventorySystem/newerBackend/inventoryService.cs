using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using product;

namespace Services
{
    public interface IInventoryService
    {
        void AddProduct(Product product);
        void RemoveProduct(int productID);
        void CheckThreshold(int threshold);
        List<Product> GetAllProducts();
    }

    public class InventoryService : IInventoryService
    {
        private readonly string connectionString = "Server=localhost;Database=InventoryDB;User=root;Password=Leil@123456;";

        public void AddProduct(Product product)
        {
            using (var connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                string query = "INSERT INTO Products (Name, Category, Quantity, ExpirationDate) VALUES (@name, @category, @quantity, @expDate)";
                using (var command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@name", product.Name);
                    command.Parameters.AddWithValue("@category", product.Category);
                    command.Parameters.AddWithValue("@quantity", product.Quantity);
                    command.Parameters.AddWithValue("@expDate", product.ExpirationDate);
                    command.ExecuteNonQuery();
                }
            }
        }

        public void RemoveProduct(int productID)
        {
            using (var connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                string query = "DELETE FROM Products WHERE ProductID = @productID";
                using (var command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@productID", productID);
                    command.ExecuteNonQuery();
                }
            }
        }

        public void CheckThreshold(int threshold)
        {
            List<Product> products = GetAllProducts();
            foreach (var product in products)
            {
                if (product.Quantity < threshold)
                {
                    Console.WriteLine($"Alert: {product.Name} is below the threshold with only {product.Quantity} units left.");
                }
            }
        }

        public List<Product> GetAllProducts()
        {
            List<Product> products = new List<Product>();
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
                            var product = new Product(
                                reader.GetString("Name"),
                                reader.GetString("Category"),
                                reader.GetInt32("Quantity"),
                                reader.GetDateTime("ExpirationDate")
                            )
                            {
                                ProductID = reader.GetInt32("ProductID") 
                            };
                            products.Add(product);
                        }
                    }
                }
            }
            return products;
        }
    }
}
