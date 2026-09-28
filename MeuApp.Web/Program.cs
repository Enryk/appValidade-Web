using Microsoft.EntityFrameworkCore;
using MeuApp.Web.Components;
using MeuApp.Shared.Data;
using MeuApp.Shared.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// Database (SQLite)
var dbPath = Path.Combine(builder.Environment.ContentRootPath, "Data", "app_validade.db");
var dataDir = Path.GetDirectoryName(dbPath);
if (!string.IsNullOrEmpty(dataDir) && !Directory.Exists(dataDir))
{
    Directory.CreateDirectory(dataDir);
}

builder.Services.AddDbContextFactory<AppDbContext>(options =>
{
    options.UseSqlite($"Data Source={dbPath}");
});

// Services
builder.Services.AddScoped<IValidadeService, ValidadeService>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// Inicialização defensiva do banco e migrações
using (var scope = app.Services.CreateScope())
{
    try
    {
        var validadeService = scope.ServiceProvider.GetRequiredService<IValidadeService>();
        await validadeService.InicializarBancoESeedAsync();
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Erro ao inicializar o banco de dados na inicialização.");
    }
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}
app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();

app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode()
    .AddAdditionalAssemblies(typeof(MeuApp.Shared.Pages.Home).Assembly);

app.Run();
