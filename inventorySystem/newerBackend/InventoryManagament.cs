using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using System.Threading.Tasks;
using product;

namespace inventorySystem
{
    public class InventoryManagament
    {
        

        public List<Product> Products { get; set; }
        public int Treshold { get; private set; }

        public InventoryManagament(int treshold) {
            Products = new List<Product>();
            Treshold = treshold;
        
        }
         
        public void AddProduct(Product product)
        {
            string connectionString = "Server=localhost;Database=inventorydb;User=root;Password=Leil@123456;";
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "INSERT INTO Products (Name, Category, Quantity, ExpirationDate) VALUES (@name, @category, @quantity, @expDate)";
                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@name", product.Name);
                    command.Parameters.AddWithValue("@category", product.Category);
                    command.Parameters.AddWithValue("@quantity", product.Quantity);
                    command.Parameters.AddWithValue("@expDate", product.ExpirationDate);

                    command.ExecuteNonQuery();
                    Console.WriteLine("Product added successfully.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error: " + ex.Message);
                }
            }
        }

        // Remove a product from the database
        public void RemoveProduct(int productID)
        {
            string connectionString = "Server=localhost;Database=inventorydb;User=root;Password=Leil@123456;";
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "DELETE FROM Products WHERE ProductID = @productID";
                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@productID", productID);

                    int result = command.ExecuteNonQuery();
                    if (result > 0)
                    {
                        Console.WriteLine("Product removed successfully.");
                    }
                    else
                    {
                        Console.WriteLine("Product not found.");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error: " + ex.Message);
                }
            }
        }

        // Check if any product's quantity falls below the threshold



        public void CheckThreshold()
        {
            bool allFine = true; // Flag to check if everything is fine
            foreach (var product in Products)
            {
                if (product.Quantity < Treshold)
                {
                    Console.WriteLine($"Alert: {product.Name} is below the threshold with only {product.Quantity} units left.");
                    allFine = false; // If any product is below threshold, set flag to false
                }
            }

            // Print "Everything looks fine!" only if no product is below the threshold
            if (allFine)
            {
                Console.WriteLine("Everything looks fine! No product is below the threshold.");
            }
        }
        // Process a sale, decreasing stock and updating the database
        public void ProcessSale(Product product, int quantitySold)
        {
            if (product.Quantity >= quantitySold)
            {
                // Remove stock from product
                product.UpdateQuantity(product.Quantity - quantitySold);
                UpdateProductInDatabase(product); // Update stock in the database
                Console.WriteLine($"Sold {quantitySold} units of {product.Name}. Remaining stock: {product.Quantity}");
            }
            else
            {
                Console.WriteLine("Not enough stock to complete the sale.");
            }
        }

        // Process a purchase, increasing stock and updating the database
        public void ProcessPurchase(Product product, int quantityPurchased)
        {
            // Add stock to the product
            product.UpdateQuantity(product.Quantity + quantityPurchased);
            UpdateProductInDatabase(product); // Update stock in the database
            Console.WriteLine($"Purchased {quantityPurchased} units of {product.Name}. Updated stock: {product.Quantity}");
        }

        // Method to update product quantity in the database
        private void UpdateProductInDatabase(Product product)
        {
            string connectionString = "Server=localhost;Database=inventorydb;User=root;Password=Leil@123456;";
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "UPDATE Products SET Quantity = @quantity WHERE ProductID = @productID";
                    MySqlCommand command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@quantity", product.Quantity);
                    command.Parameters.AddWithValue("@productID", product.ProductID);
                    command.ExecuteNonQuery();
                    Console.WriteLine("Product stock updated in database.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error updating product in database: " + ex.Message);
                }
            }
        }

        }
}
