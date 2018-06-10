using Blazor.Extensions.Logging;
using Blazor.Extensions.Storage;
using Microsoft.AspNetCore.Blazor.Browser.Rendering;
using Microsoft.AspNetCore.Blazor.Browser.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace BlazorActivityTracker
{
    public class Program
    {
        static void Main(string[] args)
        {
            var serviceProvider = new BrowserServiceProvider(services =>
            {
				services.AddStorage();

				services.AddLogging(builder => builder
					.AddBrowserConsole() // Register the logger with the ILoggerBuilder
					.SetMinimumLevel(LogLevel.Information) // Set the minimum log level to Information
				);
			});

            new BrowserRenderer(serviceProvider).AddComponent<App>("app");
		}
    }
}
