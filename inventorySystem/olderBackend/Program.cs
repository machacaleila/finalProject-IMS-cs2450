using System;
using MySql.Data.MySqlClient;
using product;
using inventorySystem;
//using Microsoft.AspNetCore.Builder;
//using Microsoft.Extensions.DependencyInjection;
using Services;
using TicketProcessor;
using System.ComponentModel.DataAnnotations.Schema;

public class Final
{
    public static void Main(string[] args)
    {
        InventoryManagament inventoryManager = new InventoryManagament(10);

        bool running = true;
        var builder = WebApplication.CreateBuilder(args);

        //Register InventoryService with DI container

        builder.Services.AddControllers();
        builder.Services.AddScoped<IInventoryService, InventoryService>();

        var app = builder.Build();

        //Map API Controllers
        app.MapControllers();

        app.Run();
      
        while (running)
        {
            Console.Clear();
            Console.WriteLine("Inventory Management System");
            Console.WriteLine("1. Add Product");
            Console.WriteLine("2. Remove Product");
            Console.WriteLine("3. Check Threshold");
            Console.WriteLine("4. New Sale");
            Console.WriteLine("5. Add Purchase");
            Console.WriteLine("6. Display database");
            Console.WriteLine("7. Exit");
            Console.Write("Select an option (1-4): ");
            string choice = Console.ReadLine();

            switch (choice)
            {
                case "1":
                    AddProduct(inventoryManager);
                    break;
                case "2":
                    RemoveProduct(inventoryManager);
                    break;
                case "3":
                    inventoryManager.CheckThreshold();
                    break;
                case "4":
                    ProcessSale(inventoryManager);
                    break;
                case "5":
                    ProcessPurchase(inventoryManager);
                    break;
                case "6":
                    DisplayProducts();
                    break;
                case "7":
                    running = false;
                    break;
                default:
                    Console.WriteLine("Invalid choice! Please select again.");
                    break;
            }
        }
    }

    // Method to add product
    static void AddProduct(InventoryManagament inventoryManager)

    {
        Console.Write("Enter Product Name: ");
        string name = Console.ReadLine();

        Console.Write("Enter Product Category: ");
        string category = Console.ReadLine();

        Console.Write("Enter Product Quantity: ");
        int quantity = int.Parse(Console.ReadLine());

        Console.Write("Enter Product Expiration Date (yyyy-mm-dd): ");
        DateTime expDate = DateTime.Parse(Console.ReadLine());

        Product newProduct = new Product(name, category, quantity, expDate);
        inventoryManager.AddProduct(newProduct);

        Console.WriteLine("Product added. Press any key to continue...");
        Console.ReadKey();
    }

    // Method to remove product
    static void RemoveProduct(InventoryManagament inventoryManager)
    {
        Console.Write("Enter Product ID to remove: ");
        int productID = int.Parse(Console.ReadLine());
        inventoryManager.RemoveProduct(productID);

        Console.WriteLine("Press any key to continue...");
        Console.ReadKey();
    }

    // Method to display products
    static void DisplayProducts()
    {
        Console.WriteLine("\nDisplaying Products...");
        Product.DisplayProducts();
        Console.WriteLine("\nPress any key to continue...");
        Console.ReadKey();
    }

    // Method to process a sale
    static void ProcessSale(InventoryManagament inventoryManager)
    {
        Console.Write("Enter Product ID for sale: ");
        int productID = int.Parse(Console.ReadLine());
        Console.Write("Enter quantity sold: ");
        int quantitySold = int.Parse(Console.ReadLine());

        Product product = inventoryManager.Products.FirstOrDefault(p => p.ProductID == productID);
        if (product != null)
        {
            inventoryManager.ProcessSale(product, quantitySold);  // Process sale
        }
        else
        {
            Console.WriteLine("Product not found.");
        }
    }
    static void ProcessPurchase(InventoryManagament inventoryManager)
    {
        Console.Write("Enter Product ID for purchase: ");
        int productID = int.Parse(Console.ReadLine());
        Console.Write("Enter quantity purchased: ");
        int quantityPurchased = int.Parse(Console.ReadLine());

        Product product = inventoryManager.Products.FirstOrDefault(p => p.ProductID == productID);
        if (product != null)
        {
            inventoryManager.ProcessPurchase(product, quantityPurchased);  // Process purchase
        }
        else
        {
            Console.WriteLine("Product not found.");
        }
    }

}

