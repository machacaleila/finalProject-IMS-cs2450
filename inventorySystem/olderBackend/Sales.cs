using System;
using product;

namespace sales
{
    public class Sales : ISales
    {
        public int SaleID { get; set; }
        public int QuantitySold { get; set; }
        public DateTime SaleDate { get; set; }

        public Product _product;

        public Sales(int saleID, int quantitySold, DateTime saleDate, Product product)
        {

            SaleID = saleID;
            QuantitySold = quantitySold;
            SaleDate = saleDate;
            _product = product;

        }
        public void AddStock(int quantity)
        {
            _product.UpdateQuantity(_product.Quantity + quantity);  // Increase stock in the product
            Console.WriteLine($"Added {quantity} units of {_product.Name} to stock.");
        }

        // Method to remove stock from the product (due to sales)
        public void RemoveStock(int quantity)
        {
            if (_product.Quantity >= quantity)
            {
                _product.UpdateQuantity(_product.Quantity - quantity);  // Decrease stock in the product
                Console.WriteLine($"Removed {quantity} units of {_product.Name} from stock.");
            }
            else
            {
                Console.WriteLine("Not enough stock to remove.");
            }
        }

        // Method to generate a sales report
        public void GenerateSalesReport()
        {
            Console.WriteLine("Sales Report:");
            Console.WriteLine($"Sale ID: {SaleID}");
            Console.WriteLine($"Quantity Sold: {QuantitySold}");
            Console.WriteLine($"Sale Date: {SaleDate.ToShortDateString()}");
            Console.WriteLine($"Remaining Stock: {_product.Quantity}");
        }

    }  
    public interface ISales
        {
            // Properties
            int SaleID { get; set; }
            int QuantitySold { get; set; }
            DateTime SaleDate { get; set; }

            // Methods
            void AddStock(int quantity);
            void RemoveStock(int quantity);
            void GenerateSalesReport();
        }

}

