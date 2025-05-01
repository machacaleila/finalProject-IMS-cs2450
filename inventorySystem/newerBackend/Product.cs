using MySql.Data.MySqlClient;
using System;



namespace product
{
    public class Product
    {
      public int ProductID { get; set; }
      public string Name { get; set; }  
      public string Category { get; set; }  
      public int Quantity { get; set; }
      public DateTime ExpirationDate { get; set; }
       
        public Product( string name, string category, int quantity, DateTime expDate) {
           
            Name = name; 
            Category = category;
            Quantity = quantity;
            ExpirationDate = expDate;
        }

        public bool checkExpiration() { 
          return DateTime.Now < ExpirationDate;
        }
        public void updateQuantity(int newQuantity)
        {
            Quantity = newQuantity;
        }

        public void UpdateQuantity(int newQuantity)
        {
            Quantity = newQuantity;
        }

        public static void DisplayProducts()
        {
            string connectionString = "Server=localhost;Database=inventorydb;User=root;Password=Leil@123456;";  
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "SELECT * FROM Products";

                    MySqlCommand command = new MySqlCommand(query, connection);
                    MySqlDataReader reader = command.ExecuteReader();

                    // Check if there are rows to display
                    if (reader.HasRows)
                    {
                        Console.WriteLine("ProductID | Name          | Category   | Quantity | ExpirationDate");
                        Console.WriteLine("---------------------------------------------------------------");

                        while (reader.Read())
                        {
                            // Reading the data from the MySQL result
                            int productID = reader.GetInt32("ProductID");
                            string name = reader.GetString("Name");
                            string category = reader.GetString("Category");
                            int quantity = reader.GetInt32("Quantity");
                            DateTime expDate = reader.GetDateTime("ExpirationDate");

                            // Displaying the product data in the console
                            Console.WriteLine($"{productID,-9} | {name,-12} | {category,-10} | {quantity,-8} | {expDate.ToShortDateString()}");
                        }
                    }
                    else
                    {
                        Console.WriteLine("No products found.");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error: " + ex.Message);
                }
            }
        }

    }
}
