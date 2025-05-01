using System.Text.Json;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

var app = builder.Build();
app.UseCors(x => x.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

// File names
string productsFileName = "products.json";
string purchaseFileName = "purchase.json";
string sellFileName = "sell.json";
string customersFileName = "customers.json";
string suppliersFileName = "suppliers.json";
string categoriesFileName = "categories.json";
string usersFileName = "users.json";
// Initializing the dictionary for all files
List<Product> products = new();
List<Purchase> purchases = new();
List<Sales> sales = new();
List<Customer> customers = new();
List<Supplier> suppliers = new();
List<Category> categories = new();
List<User> users = new();
// Loading from file
if (File.Exists(productsFileName))
{
    var json = File.ReadAllText(productsFileName);
    products.AddRange(JsonSerializer.Deserialize<List<Product>>(json));
}
if (File.Exists(purchaseFileName))
{
    var json = File.ReadAllText(purchaseFileName);
    purchases.AddRange(JsonSerializer.Deserialize<List<Purchase>>(json));
}
if (File.Exists(sellFileName))
{
    var json = File.ReadAllText(sellFileName);
    sales.AddRange(JsonSerializer.Deserialize<List<Sales>>(json));
}
if (File.Exists(customersFileName))
{
    var json = File.ReadAllText(customersFileName);
    customers.AddRange(JsonSerializer.Deserialize<List<Customer>>(json));
}
if (File.Exists(suppliersFileName))
{
    var json = File.ReadAllText(suppliersFileName);
    suppliers.AddRange(JsonSerializer.Deserialize<List<Supplier>>(json));
}
if (File.Exists(categoriesFileName))
{
    var json = File.ReadAllText(categoriesFileName);
    categories.AddRange(JsonSerializer.Deserialize<List<Category>>(json));
}
if (File.Exists(usersFileName))
{
    var json = File.ReadAllText(usersFileName);
    users.AddRange(JsonSerializer.Deserialize<List<User>>(json));
}

// API Endpoints

//Get Endpoint
app.MapGet("/", () => "Hello World!");
app.MapGet("/products", () => products);
app.MapGet("/sales", () => sales);
app.MapGet("/purchases", () => purchases);
app.MapGet("/customers", () => customers);
app.MapGet("/suppliers", () => suppliers);
app.MapGet("/categories", () => categories);
app.MapGet("/product/{id}", (string id) =>
{
    var product = products.FirstOrDefault(p => p.Id == id);

    if (product != null)
    {
        return Results.Ok(product);
    }
    return Results.NotFound(new { message = "Product not found." });
});

// Post Endpoints
app.MapPost("/product", (Product newProduct) =>
{
    // Find the existing product by Id for edit feature
    var existingProduct = products.FirstOrDefault(p => p.Id == newProduct.Id);
    if (existingProduct != null)
    {
        var index = products.IndexOf(existingProduct);
        products[index] = newProduct;
    }
    else
    {
        products.Add(newProduct);
    }
    var json = JsonSerializer.Serialize(products);
    File.WriteAllText(productsFileName, json);
});

app.MapPost("/user-login", (User loginAttempt) =>
{
    var existingUser = users.FirstOrDefault(u => u.Id == loginAttempt.Id);
    if (existingUser == null)
    {
        return Results.NotFound(new { message = "User not found." });
    }
    if (existingUser.Password != loginAttempt.Password)
    {
        return Results.BadRequest(new { message = "Incorrect password." });
    }
    return Results.Ok(new { message = "Login successful!", userName = existingUser.Name });
});

app.MapPost("/user-signup", (User newUser) =>
{
    var existingUser = users.FirstOrDefault(u => u.Id == newUser.Id);
    if (existingUser != null)
    {
        return Results.BadRequest(new { message = "User already exists with the same ID." });
    }
    users.Add(newUser);
    var json = JsonSerializer.Serialize(users);
    File.WriteAllText(usersFileName, json);
    return Results.Ok(newUser);
});

app.MapPost("/delete-product/{id}", (string id) =>
{
    var productToDelete = products.FirstOrDefault(p => p.Id == id);

    if (productToDelete != null)
    {
        products.Remove(productToDelete);
        var json = JsonSerializer.Serialize(products);
        File.WriteAllText(productsFileName, json);
    }

});

app.MapPost("/category", (Category newCat) =>
{
    categories.Add(newCat);
    var json = JsonSerializer.Serialize(categories);
    File.WriteAllText(categoriesFileName, json);

});
app.MapPost("/supplier", (Supplier newSupp) =>
{
    suppliers.Add(newSupp);
    var json = JsonSerializer.Serialize(suppliers);
    File.WriteAllText(suppliersFileName, json);

});
app.MapPost("/customer", (Customer newCustomer) =>
{
    customers.Add(newCustomer);
    var json = JsonSerializer.Serialize(customers);
    File.WriteAllText(customersFileName, json);
});
app.MapPost("/purchase", (Purchase newPurchase) =>
{
    purchases.Add(newPurchase);
    
    var product = products.FirstOrDefault(p => p.Id == newPurchase.ProductId);
    if (product != null)
    {
        var index = products.IndexOf(product);
        products[index] = product with
        {
            Quantity = product.Quantity + newPurchase.QuantityPurchased
        };
        
        var updatedProductsJson = JsonSerializer.Serialize(products);
        File.WriteAllText(productsFileName, updatedProductsJson);
    }

    var json = JsonSerializer.Serialize(purchases);
    File.WriteAllText(purchaseFileName, json);
});
app.MapPost("/sale", (Sales newSell) =>
{
    sales.Add(newSell);

    var product = products.FirstOrDefault(p => p.Id == newSell.ProductId);
    if (product != null)
    {
        var index = products.IndexOf(product);
        products[index] = product with
        {
            Quantity = product.Quantity - newSell.QuantitySold
        };
        
        var updatedProductsJson = JsonSerializer.Serialize(products);
        File.WriteAllText(productsFileName, updatedProductsJson);
    }

    var json = JsonSerializer.Serialize(sales);
    File.WriteAllText(sellFileName, json);
});


app.Run();

// records for custom data types
public record Product(
    string Id,
    string Name,
    string Category,
    int Quantity,
    string Unit,
    decimal SellingPrice,
    decimal PurchasePrice,
    DateTime ExpiryDate,
    string Supplier
);
public record Purchase(
    string Id,
    string ProductId,
    int QuantityPurchased,
    DateTime PurchaseDate,
    string Supplier
);
public record Sales(
    string Id,
    string ProductId,
    int QuantitySold,
    DateTime SellDate,
    string Buyer
);
public record Supplier(
    string Id,
    string Name,
    string ContactPerson,
    string Phone,
    string Email,
    string Address,
    List<string> ProductsSupplied
);
public record Customer(
    string Id,
    string Name,
    string Phone,
    string Email,
    string Address,
    DateTime JoinDate
);

public record Category(
    string Id,
    string Name,
    string Description
);
public record User(
    string Id,
    string Name,
    string Password
);

