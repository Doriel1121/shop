using Microsoft.EntityFrameworkCore;
using CategoriesApi.Models;

namespace CategoriesApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Seed initial data
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "אלקטרוניקה", Description = "מוצרי אלקטרוניקה ומחשבים" },
                new Category { Id = 2, Name = "ביגוד", Description = "בגדים ואביזרי אופנה" },
                new Category { Id = 3, Name = "בית וגן", Description = "מוצרים לבית ולגן" },
                new Category { Id = 4, Name = "ספרים", Description = "ספרים וחומרי קריאה" },
                new Category { Id = 5, Name = "ספורט", Description = "ציוד ספורט ופעילות גופנית" }
            );
        }
    }
}