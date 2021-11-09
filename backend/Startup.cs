using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using prid_tuto.Models;
using AutoMapper;
using AutoMapper.EquivalencyExpression;
using Microsoft.IdentityModel.Tokens;


namespace prid_tuto
{
    public class Startup
    {
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) {
            // services.AddDbContext<MsnContext>(opt => opt.UseSqlite("data source=msn.db"));

            services.AddDbContext<MsnContext>(opt => opt.UseSqlite(
               Configuration.GetConnectionString("prid-tuto-sqlite")
            ));
            // services.AddDbContext<MsnContext>(opt => opt.UseSqlServer(
            //     Configuration.GetConnectionString("prid-tuto-mssql")
            // ));
            // services.AddDbContext<MsnContext>(opt => opt.UseMySql(
            //     Configuration.GetConnectionString("prid-tuto-mysql"),
            //     ServerVersion.Parse("10.4.18-mariadb")
            // )); 


            services.AddControllers();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration => {
                // configuration.RootPath = "frontend/dist"; // before heroku
                // backend où il doit aller chercher les fichiers statiques sur le disque dur pour les envoyer au client
                //  https://prid2122-tuto.herokuapp.com/index.html, c'est le fichier backend\wwwroot\frontend\index.html 
                configuration.RootPath = "wwwroot/frontend";
            });
            services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "prid_tuto", Version = "v1" });
            });

            // Auto Mapper Configurations
            services.AddScoped(provider => new MapperConfiguration(cfg => {
            cfg.AddProfile(new MappingProfile(provider.GetService<MsnContext>()));
            // see: https://github.com/AutoMapper/AutoMapper.Collection
            cfg.AddCollectionMappers();
            cfg.UseEntityFrameworkCoreModel<MsnContext>(services);
            }).CreateMapper());

            //------------------------------ 
            // configure jwt authentication 
            //------------------------------ 

            // Notre clé secrète pour les jetons sur le back-end 
            var key = Encoding.ASCII.GetBytes("my-super-secret-key");
            // On précise qu'on veut travaille avec JWT tant pour l'authentification  
            // que pour la vérification de l'authentification 
            services.AddAuthentication(x => {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(x => {
                    // On exige des requêtes sécurisées avec HTTPS 
                    x.RequireHttpsMetadata = true;
                    x.SaveToken = true;
                    // On précise comment un jeton reçu doit être validé 
                    x.TokenValidationParameters = new TokenValidationParameters {
                        // On vérifie qu'il a bien été signé avec la clé définie ci-dessous 
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        // On ne vérifie pas l'identité de l'émetteur du jeton 
                        ValidateIssuer = false,
                        // On ne vérifie pas non plus l'identité du destinataire du jeton 
                        ValidateAudience = false,
                        // Par contre, on vérifie la validité temporelle du jeton 
                        ValidateLifetime = true,
                        // On précise qu'on n'applique aucune tolérance de validité temporelle 
                        ClockSkew = TimeSpan.Zero  //the default for this setting is 5 minutes 
                    };
                    // On peut définir des événements liés à l'utilisation des jetons 
                    x.Events = new JwtBearerEvents {
                        // Si l'authentification du jeton est rejetée ... 
                        OnAuthenticationFailed = context => {
                            // ... parce que le jeton est expiré ... 
                            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException)) {
                                // ... on ajoute un header à destination du front-end indiquant cette expiration 
                                context.Response.Headers.Add("Token-Expired", "true");
                            }
                            return Task.CompletedTask;
                        }
                    };
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, MsnContext context) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "prid_tuto v1"));
            }

            if (context.Database.IsSqlite())
                /*
                La suppression complète de la base de données n'est pas possible si celle-ci est ouverte par un autre programme,
                comme par exemple "DB Browser for SQLite" car les fichiers correspondants sont verrouillés.
                Pour contourner ce problème, on exécute cet ensemble de commandes qui vont supprimer tout le contenu de la DB.
                La dernière commande permet de réduire la taille du fichier au minimum.
                (voir https://stackoverflow.com/a/548297)
                */
                context.Database.ExecuteSqlRaw(
                    @"PRAGMA writable_schema = 1;
                    delete from sqlite_master where type in ('table', 'index', 'trigger', 'view');
                    PRAGMA writable_schema = 0;
                    VACUUM;");
            else
                context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            // why ? for which purpose ?
            app.UseDefaultFiles();

            app.UseStaticFiles();
            if (!env.IsDevelopment()) {
                app.UseSpaStaticFiles();
            }

            app.UseAuthentication();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
            });

            app.UseSpa(spa => {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501
                spa.Options.SourcePath = "frontend";
                if (env.IsDevelopment()) {
                    //spa.UseAngularCliServer(npmScript: "start");
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });
            
        }
    }
}
