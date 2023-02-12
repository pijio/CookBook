using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CookBook.API.Services;
using CookBook.App;
using CookBook.App.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace CookBook.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public IConfiguration Configuration { get; }
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddSwaggerGen(s =>
            {
                s.SwaggerDoc("v1", new OpenApiInfo { Title = "Cook book API", Version = "v1" });
                s.CustomSchemaIds(x=> x.FullName);
            });
            services.AddCors(o => o.AddPolicy("ApiPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            }));
            services.AddSingleton<IConfigurationService, ConfigurationService>();
            services.AddScoped(typeof(ICrudService<>), typeof(CrudService<>));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseHsts();
            app.UseRouting();
            app.UseCors("ApiPolicy");
            app.UseHttpsRedirection();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}