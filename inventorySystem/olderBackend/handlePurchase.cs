using product;
using sales;
using TicketProcessor;

namespace handlePurchase
{
    internal class handlePurchase
    {
        // Example method to handle sales
        public void ProcessSale(Product product, int quantitySold)
        {
            Sales sale = new Sales(1, quantitySold, DateTime.Now, product);
            sale.RemoveStock(quantitySold);  // Decrease stock
            // Additional logic to update the sale information in the database
        }

        // Example method to handle purchases
        public void ProcessPurchase(Product product, int quantityPurchased)
        {
            Purchase purchase = new Purchase(product.ProductID, quantityPurchased, DateTime.Now);
            purchase.AddStock(product);  // Increase stock
            // Additional logic to update the purchase in the database if needed
        }
    }
}
