using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace prid2122_g03.Models
{
    public class CvContext : DbContext
    {
        public CvContext(DbContextOptions<CvContext> options)
            : base(options) {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder
                .LogTo(Console.WriteLine, LogLevel.Information)
                .EnableSensitiveDataLogging();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            // modelBuilder.Entity<Member>()
            //     .HasMany(left => left.Followers)
            //     .WithMany(right => right.Followees)
            //     .UsingEntity<Follow>(
            //         right => right.HasOne(m => m.Follower).WithMany(),
            //         left => left.HasOne(m => m.Followee).WithMany()
            //     );

            // modelBuilder.Entity<Member>().HasIndex(m => m.FullName).IsUnique();

            // modelBuilder.Entity<Member>().HasData(
            //     new Member { Pseudo = "admin", Password = "admin", FullName = "Admin", Role = Role.Admin },
            //     new Member { Pseudo = "ben", Password = "ben", FullName = "Benoît Penelle", BirthDate = new DateTime(1970, 1, 2) },
            //     new Member { Pseudo = "bruno", Password = "bruno", FullName = "Bruno Lacroix", BirthDate = new DateTime(1971, 2, 3) },
            //     new Member { Pseudo = "alain", Password = "alain", FullName = "Alain Silovy" },
            //     new Member { Pseudo = "xavier", Password = "xavier", FullName = "Xavier Pigeolet" },
            //     new Member { Pseudo = "boris", Password = "boris", FullName = "Boris Verhaegen" },
            //     new Member { Pseudo = "marc", Password = "marc", FullName = "Marc Michel" }
            // );

            // Attention: add foreign keys in modelBuilders 

            // modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

            // modelBuilder.Entity<User>().HasData(
            //     new Consultant { Id = 1, LastName = "Schiltz", FirstName = "Séverine", Email = "ss@epfc.eu", Password = "sev"},
            //     new Consultant { Id = 2, LastName = "Boudghene", FirstName = "Ines", Email = "ib@epfc.eu", Password = "ines"},
            //     new Manager { Id = 3, LastName = "Lacroix", FirstName = "Bruno", Email = "bl@epfc.eu", Password = "bruno"},
            //     new Manager { Id = 4, LastName = "Penelle", FirstName = "Benoît", Email = "bp@epfc.eu", Password = "ben"}        
            // ); 


            modelBuilder.Entity<Manager>().HasIndex(m => m.Email).IsUnique();

            modelBuilder.Entity<Manager>().HasData(
                new Manager { Id = 1, LastName = "Lacroix", FirstName = "Bruno", Email = "bl@epfc.eu", Password = "bruno", Title = Title.Manager, BirthDate = new DateTime(1985, 12, 31) },
                new Manager { Id = 2, LastName = "Penelle", FirstName = "Benoît", Email = "bp@epfc.eu", Password = "ben", Title = Title.Manager, BirthDate = new DateTime(1986, 12, 31) },
                new Manager { Id = 5, LastName = "Sytem", FirstName = "Admin", Email = "as@epfc.eu", Password = "admin", Title = Title.AdminSystem, BirthDate = new DateTime(1982, 01, 01) },
                new Manager { Id = 6, LastName = "Manager6", FirstName = "M6", Email = "m6@epfc.eu", Password = "manager", Title = Title.Manager, BirthDate = new DateTime(1983, 01, 16) }
            );

            modelBuilder.Entity<Consultant>().HasIndex(c => c.Email).IsUnique();

            modelBuilder.Entity<Consultant>().HasData(
                new Consultant { Id = 3, LastName = "Schiltz", FirstName = "Séverine", Email = "ss@epfc.eu", Password = "sev", ManagerId = 1, BirthDate = new DateTime(1990, 01, 16) },
                new Consultant { Id = 4, LastName = "Boudghene", FirstName = "Ines", Email = "ib@epfc.eu", Password = "ines", ManagerId = 1, BirthDate = new DateTime(1984, 01, 16) },
                new Consultant { Id = 7, LastName = "Consultant7", FirstName = "Consul7", Email = "c7@epfc.eu", Password = "consul", BirthDate = new DateTime(1985, 01, 16) },
                new Consultant { Id = 8, LastName = "Consultant8", FirstName = "Consul8", Email = "c8@epfc.eu", Password = "consul2", ManagerId = 2, BirthDate = new DateTime(1986, 01, 16) }

            );

            //Mettre les clients des missions à NULL lorsqu'on les supprime
            modelBuilder.Entity<Enterprise>()
            .HasMany(e => e.Missions) 
            .WithOne(m => m.Client) 
            .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Enterprise>().HasData(
                new Enterprise { Id = 1, Name = "Enterprise1" },
                new Enterprise { Id = 2, Name = "Enterprise2" },
                new Enterprise { Id = 3, Name = "Enterprise3" },
                new Enterprise { Id = 4, Name = "Enterprise4" },
                new Enterprise { Id = 5, Name = "Enterprise5" },
                new Enterprise { Id = 6, Name = "EPFC" },
                new Enterprise { Id = 7, Name = "ULB" },
                new Enterprise { Id = 8, Name = "UCL" }
            );

            // modelBuilder.Entity<Experience>().HasData(
            //     new Experience { Id = 1, Start = new DateTime(2015, 1, 2), Finish = new DateTime(2015, 3, 2), Title = "Analyse", Description = "A", EnterpriseId = 1, UserId = 4 },
            //     new Experience { Id = 2, Start = new DateTime(2016, 1, 2), Finish = new DateTime(2016, 3, 2), Title = "Programmation", Description = "P", EnterpriseId = 1, UserId = 4 },
            //     new Experience { Id = 3, Start = new DateTime(2017, 1, 2), Finish = new DateTime(2017, 3, 2), Title = "Testing", Description = "T", EnterpriseId = 2, UserId = 4 }
            // );


            modelBuilder.Entity<Mission>().HasData(
                new Mission { Id = 1, Start = new DateTime(2015, 1, 2), Finish = new DateTime(2015, 3, 2), Title = "Mission1", Description = "M1", EnterpriseId = 2, UserId = 4, ClientId = 2 },
                new Mission { Id = 2, Start = new DateTime(2016, 1, 2), Finish = null, Title = "Mission2", Description = "M2", EnterpriseId = 1, UserId = 4, ClientId = 3 },
                new Mission { Id = 3, Start = new DateTime(2016, 2, 2), Finish = new DateTime(2016, 3, 2), Title = "Mission3", Description = "M3", EnterpriseId = 1, UserId = 1, ClientId = 3 },
                new Mission { Id = 4, Start = new DateTime(2015, 4, 2), Finish = new DateTime(2015, 5, 2), Title = "Mission4", Description = "M4", EnterpriseId = 1, UserId = 4, ClientId = 2 },
                new Mission { Id = 5, Start = new DateTime(2016, 6, 2), Finish = new DateTime(2016, 7, 2), Title = "Mission5", Description = "M5", EnterpriseId = 1, UserId = 4, ClientId = 3 },
                new Mission { Id = 6, Start = new DateTime(2015, 8, 2), Finish = new DateTime(2015, 9, 2), Title = "Mission6", Description = "M6", EnterpriseId = 1, UserId = 4, ClientId = 2 },
                new Mission { Id = 7, Start = new DateTime(2016, 10, 2), Finish = new DateTime(2016, 11, 2), Title = "Mission7", Description = "M7", EnterpriseId = 1, UserId = 4, ClientId = 3 },
                new Mission { Id = 8, Start = new DateTime(2016, 12, 2), Finish = new DateTime(2017, 2, 2), Title = "Mission8", Description = "M8", EnterpriseId = 1, UserId = 7, ClientId = 3 },
                new Mission { Id = 9, Start = new DateTime(2018, 1, 2), Finish = new DateTime(2019, 12, 20), Title = "Mission9", Description = "M9", EnterpriseId = 1, UserId = 1, ClientId = 3 },
                new Mission { Id = 10, Start = new DateTime(2020, 1, 2), Finish = new DateTime(2021, 3, 2), Title = "Mission10", Description = "M10", EnterpriseId = 1, UserId = 1 }
            );

            // modelBuilder.Entity<Training>().HasData(
            //     new Experience { Id = 1, Start = new DateTime(2015, 1, 2), Finish = new DateTime(2015, 3, 2), Title = "Analyse", Description = "A", EnterpriseId = 1, UserId = 4 },
            //     new Experience { Id = 2, Start = new DateTime(2016, 1, 2), Finish = new DateTime(2016, 3, 2), Title = "Programmation", Description = "P", EnterpriseId = 1, UserId = 4 },
            //     new Experience { Id = 3, Start = new DateTime(2017, 1, 2), Finish = new DateTime(2017, 3, 2), Title = "Testing", Description = "T", EnterpriseId = 2, UserId = 4 }
            // );


            modelBuilder.Entity<Category>().HasIndex(c => c.Name).IsUnique();

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "IT languages" },
                new Category { Id = 2, Name = "Database" },
                new Category { Id = 3, Name = "Framework" },
                new Category { Id = 4, Name = "Languages" },
                new Category { Id = 5, Name = "Hobbies" }
            );

            modelBuilder.Entity<Skill>().HasIndex(c => c.Name).IsUnique();
            // skills
            modelBuilder.Entity<Skill>().HasData(
                new Skill { Id = 1, Name = "Java", CategoryId = 1 },
                new Skill { Id = 2, Name = "PHP", CategoryId = 1 },
                new Skill { Id = 3, Name = "Sqlite", CategoryId = 2 },
                new Skill { Id = 4, Name = "Entity Framework", CategoryId = 3 },
                new Skill { Id = 5, Name = "English", CategoryId = 4 },
                new Skill { Id = 6, Name = "C sharp", CategoryId = 1 },
                new Skill { Id = 7, Name = "JavaScript", CategoryId = 1 },
                new Skill { Id = 8, Name = "MySQL", CategoryId = 2 },
                new Skill { Id = 9, Name = "Angular", CategoryId = 3 },
                new Skill { Id = 10, Name = "SkillWithNoCategory", CategoryId = null }
                // ,new Skill { Id = 10, Name = "SkillWithNoCategory" } // working now :)
            );

            // foreign key constraint 1 for Mastering
            modelBuilder.Entity<Mastering>()
                .HasOne(m => m.User)
                .WithMany(u => u.MasteringSkillsLevels);

            // foreign key constraint 2 for Mastering
            modelBuilder.Entity<Mastering>()
                .HasOne(m => m.Skill)
                .WithMany(s => s.MasteringSkillsLevels);

            // masterings
            modelBuilder.Entity<Mastering>().HasData(
                new Mastering { Id = 1, Level = Level.Expert, UserId = 1, SkillId = 1 }, // Bruno   Java
                new Mastering { Id = 2, Level = Level.Senior, UserId = 2, SkillId = 2 }, // Benoît  PHP
                new Mastering { Id = 3, Level = Level.Medior, UserId = 3, SkillId = 3 }, // Sev     Sqlite      Bruno manager
                new Mastering { Id = 4, Level = Level.Junior, UserId = 4, SkillId = 4 }, // Ines    Entity      Bruno manager
                new Mastering { Id = 5, Level = Level.Senior, UserId = 1, SkillId = 2 }, // Bruno   PHP
                new Mastering { Id = 6, Level = Level.Medior, UserId = 1, SkillId = 3 }, // Bruno   Sqlite
                new Mastering { Id = 7, Level = Level.Expert, UserId = 3, SkillId = 1 }, // Sev     Java
                new Mastering { Id = 8, Level = Level.Expert, UserId = 7, SkillId = 6 }, // Cons7   C#          no manager
                new Mastering { Id = 9, Level = Level.Senior, UserId = 8, SkillId = 7 },  // Cons9   JavaScript  Ben manager
                new Mastering { Id = 10, Level = Level.Senior, UserId = 2, SkillId = 10 },  
                new Mastering { Id = 11, Level = Level.Medior, UserId = 4, SkillId = 10 }  
            );

            modelBuilder.Entity<Using>().HasData(
                new Using { Id = 1, ExperienceId = 3, SkillId = 1 },
                new Using { Id = 2, ExperienceId = 3, SkillId = 3 },
                new Using { Id = 3, ExperienceId = 11, SkillId = 1 },
                new Using { Id = 4, ExperienceId = 11, SkillId = 3 },
                new Using { Id = 5, ExperienceId = 11, SkillId = 9 },
                new Using { Id = 6, ExperienceId = 12, SkillId = 2 },
                new Using { Id = 7, ExperienceId = 12, SkillId = 9 },
                new Using { Id = 8, ExperienceId = 13, SkillId = 6 },
                new Using { Id = 9, ExperienceId = 11, SkillId = 6 },
                new Using { Id = 10, ExperienceId = 11, SkillId = 10 }
            );

            modelBuilder.Entity<Training>().HasData(
                new Training { Id = 11, Start = new DateTime(2010, 9, 15), Finish = new DateTime(2013, 9, 14), Title = "Bachelor in Mathematics", Description = "Options in IT", EnterpriseId = 6, UserId = 1, Grade = Grade.CumLaude },
                new Training { Id = 12, Start = new DateTime(2013, 9, 15), Finish = new DateTime(2015, 9, 14), Title = "Master in Cybersecurity", Description = "Options in xxx", EnterpriseId = 7, UserId = 1, Grade = Grade.MagnaCumLaude },
                new Training { Id = 13, Start = new DateTime(2014, 9, 15), Finish = new DateTime(2016, 9, 14), Title = "Master in Software Engineering", Description = "Options in xxx", EnterpriseId = 8, UserId = 3, Grade = Grade.MagnaCumLaude }
            );

        }

        public void SeedData() {
            // Database.BeginTransaction();
            // // etp & exp
            // var ent = new Enterprise("Enterprise4");
            // Enterprises.AddRange(ent);
            // var exp = new Experience(new DateTime(2017, 1, 2), new DateTime(2017, 3, 2), "Testing", "T", ent);
            // //Enterprise ent2 = Enterprises.SingleOrDefaultAsync(e => e.Id == 1); //Pq ne fonctionne pas ?
            // Experiences.AddRange(exp);

            // // consultant & manager
            // Consultant consultant3 = new Consultant("test", "test", "test@epfc.eu", "test", Managers.SingleOrDefault(m => m.Id == 1)) ;
            // Consultants.AddRange(consultant3);

            // skills
            // Skill java = new Skill("Java", Categories.SingleOrDefault(c => c.Id == 1));
            // Skill php = new Skill("PHP", Categories.SingleOrDefault(c => c.Id == 1));
            // Skill sqlite = new Skill("Sqlite", Categories.SingleOrDefault(c => c.Id == 2));
            // Skill entity = new Skill("Entity", Categories.SingleOrDefault(c => c.Id == 3));
            // Skill english = new Skill("English", Categories.SingleOrDefault(c => c.Id == 4));
            // Skills.AddRange(java, php, sqlite, entity, english);

            // mastering Level level, User user, Skill skill
            // Mastering brunoJava = new Mastering(Level.Expert, Users.SingleOrDefault(u => u.Id == 1), Skills.SingleOrDefault(s => s.Id == 1));
            // Mastering benPhp = new Mastering(Level.Senior, Users.SingleOrDefault(u => u.Id == 2), Skills.SingleOrDefault(s => s.Id == 2));
            // Mastering sevSqlite = new Mastering(Level.Medior, Users.SingleOrDefault(u => u.Id == 3), Skills.SingleOrDefault(s => s.Id == 3));
            // Mastering inesEntity = new Mastering(Level.Junior, Users.SingleOrDefault(u => u.Id == 4), Skills.SingleOrDefault(s => s.Id == 4));

            // Masterings.AddRange(brunoJava, benPhp, sevSqlite, inesEntity);

            // Skill s1 = Skills.SingleOrDefault(s => s.Id == 1);
            // Skill s3 = Skills.SingleOrDefault(s => s.Id == 3);
            // Mission m = Missions.SingleOrDefault(s => s.Id == 3);
            // m.addSkill(s1);
            // m.addSkill(s3);
            // SaveChanges();
            // Database.CommitTransaction();
        }

        public DbSet<Experience> Experiences { get; set; }
        public DbSet<Mission> Missions { get; set; }
        public DbSet<Enterprise> Enterprises { get; set; }

        public DbSet<Consultant> Consultants { get; set; }
        public DbSet<Manager> Managers { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Skill> Skills { get; set; }

        public DbSet<Mastering> Masterings { get; set; }
        public DbSet<Using> Usings { get; set; }

        public DbSet<Training> Trainings { get; set; }

    }
}
