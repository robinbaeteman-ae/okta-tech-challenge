namespace OktaChallengeAPI.Web.Data
{
    using Microsoft.EntityFrameworkCore;
    using OktaChallengeAPI.Web.Model;

    public class NotesDbContext : DbContext
    {
        public NotesDbContext(DbContextOptions<NotesDbContext> options) : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new NotesConfiguration());
        }

        public DbSet<Note> Notes { get; set; } = null!;
    }
}
