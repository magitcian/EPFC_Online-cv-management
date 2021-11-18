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

            modelBuilder.Entity<Member>()
                .HasMany(left => left.Followers)
                .WithMany(right => right.Followees)
                .UsingEntity<Follow>(
                    right => right.HasOne(m => m.Follower).WithMany(),
                    left => left.HasOne(m => m.Followee).WithMany()
                );

            modelBuilder.Entity<Member>().HasIndex(m => m.FullName).IsUnique();

            modelBuilder.Entity<Member>().HasData(
                new Member { Pseudo = "admin", Password = "admin", FullName = "Admin", Role = Role.Admin },
                new Member { Pseudo = "ben", Password = "ben", FullName = "Benoît Penelle", BirthDate = new DateTime(1970, 1, 2) },
                new Member { Pseudo = "bruno", Password = "bruno", FullName = "Bruno Lacroix", BirthDate = new DateTime(1971, 2, 3) },
                new Member { Pseudo = "alain", Password = "alain", FullName = "Alain Silovy" },
                new Member { Pseudo = "xavier", Password = "xavier", FullName = "Xavier Pigeolet" },
                new Member { Pseudo = "boris", Password = "boris", FullName = "Boris Verhaegen" },
                new Member { Pseudo = "marc", Password = "marc", FullName = "Marc Michel" }
            );       

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
                new Manager { Id = 1, LastName = "Lacroix", FirstName = "Bruno", Email = "bl@epfc.eu", Password = "bruno"},
                new Manager { Id = 2, LastName = "Penelle", FirstName = "Benoît", Email = "bp@epfc.eu", Password = "ben"}     
            );   

            modelBuilder.Entity<Consultant>().HasIndex(c => c.Email).IsUnique();

            modelBuilder.Entity<Consultant>().HasData(
                new Consultant { Id = 3, LastName = "Schiltz", FirstName = "Séverine", Email = "ss@epfc.eu", Password = "sev"}, //, Manager = manager3},
                new Consultant { Id = 4, LastName = "Boudghene", FirstName = "Ines", Email = "ib@epfc.eu", Password = "ines"}     
            );   

            modelBuilder.Entity<Phone>().HasData(
                new Phone { PhoneId = 1, Type = "aaa", Number = "123", MemberPseudo = "ben" },
                new Phone { PhoneId = 2, Type = "bbb", Number = "456", MemberPseudo = "ben" }
            );

            modelBuilder.Entity<Follow>().HasData(
                new Follow { FollowerPseudo = "ben", FolloweePseudo = "bruno" },
                new Follow { FollowerPseudo = "ben", FolloweePseudo = "alain" },
                new Follow { FollowerPseudo = "bruno", FolloweePseudo = "boris" },
                new Follow { FollowerPseudo = "bruno", FolloweePseudo = "ben" },
                new Follow { FollowerPseudo = "bruno", FolloweePseudo = "xavier" }
            );

            modelBuilder.Entity<Enterprise>().HasData(
                new Enterprise { Id = 1, Name = "Enterprise1" },
                new Enterprise { Id = 2, Name = "Enterprise2" },
                new Enterprise { Id = 3, Name = "Enterprise3" }
            );

            modelBuilder.Entity<Experience>().HasData(
                new Experience { Id = 1, Start = new DateTime(2015, 1, 2), Finish = new DateTime(2015, 3, 2), Title = "Analyse", Description = "A"},
                new Experience { Id = 2, Start = new DateTime(2016, 1, 2), Finish = new DateTime(2016, 3, 2), Title = "Programmation", Description = "P"}
            );


            modelBuilder.Entity<Category>().HasIndex(c => c.Name).IsUnique();

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "IT languages"},
                new Category { Id = 2, Name = "Database"},
                new Category { Id = 3, Name = "Framework"},
                new Category { Id = 4, Name = "Languages"},
                new Category { Id = 5, Name = "Hobbies"}
            );

            modelBuilder.Entity<Skill>().HasIndex(c => c.Name).IsUnique();
            // skills
            modelBuilder.Entity<Skill>().HasData(
                new Skill { Id = 1, Name = "Java", CategoryId = 1 },
                new Skill { Id = 2, Name = "PHP", CategoryId = 1 },
                new Skill { Id = 3, Name = "Sqlite", CategoryId = 2 },
                new Skill { Id = 4, Name = "Entity", CategoryId = 3 },
                new Skill { Id = 5, Name = "English", CategoryId = 4 }
            );


            // TODO ask Sev & Bruno to improve
            
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
                new Mastering { Id = 1, Level = Level.Expert, UserId = 1, SkillId = 1 },
                new Mastering { Id = 2, Level = Level.Senior, UserId = 2, SkillId = 2 },
                new Mastering { Id = 3, Level = Level.Medior, UserId = 3, SkillId = 3 },
                new Mastering { Id = 4, Level = Level.Junior, UserId = 4, SkillId = 4 }
            );

        }

        public void SeedData() {
            Database.BeginTransaction();
            // etp & exp
            var ent = new Enterprise("Enterprise4");
            Enterprises.AddRange(ent);
            var exp = new Experience(new DateTime(2017, 1, 2), new DateTime(2017, 3, 2), "Testing", "T", ent);
            //Enterprise ent2 = Enterprises.SingleOrDefaultAsync(e => e.Id == 1); //Pq ne fonctionne pas ?
            Experiences.AddRange(exp);

            // consultant & manager
            Consultant consultant3 = new Consultant("test", "test", "test@epfc.eu", "test", Managers.SingleOrDefault(m => m.Id == 1)) ;
            Consultants.AddRange(consultant3);

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
            SaveChanges();
            Database.CommitTransaction();
        }

        public DbSet<Member> Members { get; set; }
        public DbSet<Phone> Phones { get; set; }
        public DbSet<Follow> Follows { get; set; }
        public DbSet<Experience> Experiences { get; set; }
        public DbSet<Enterprise> Enterprises { get; set; }

        public DbSet<Consultant> Consultants { get; set; }
        public DbSet<Manager> Managers { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Skill> Skills { get; set; }

        public DbSet<Mastering> Masterings { get; set; }
    }
}
