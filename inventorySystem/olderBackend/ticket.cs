using MySql.Data.MySqlClient;
using product;
using sales;


namespace TicketProcessor
{
    public class Purchase
    {
        public int PurchaseID { get; set; }
        public int ProductID { get; set; }
        public int QuantityPurchased { get; set; }
        public DateTime PurchaseDate { get; set; }

        // Constructor
        public Purchase(int productID, int quantityPurchased, DateTime purchaseDate)
        {
            ProductID = productID;
            QuantityPurchased = quantityPurchased;
            PurchaseDate = purchaseDate;
        }

        // Method to add stock to the inventory
        public void AddStock(Product product)
        {
            int newQuantity = product.Quantity + QuantityPurchased;
            product.UpdateQuantity(newQuantity);
            UpdateProductInDatabase(product);
            Console.WriteLine($"Added {QuantityPurchased} units of {product.Name} to inventory.");
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
                    Console.WriteLine("Stock updated in database.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error updating product in database: " + ex.Message);
                }
            }
        }
    }
}
