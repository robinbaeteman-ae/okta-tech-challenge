namespace OktaChallengeAPI.Web.Data
{
    using OktaChallengeAPI.Web.Model;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;

    public class NotesConfiguration : IEntityTypeConfiguration<Note>
    {
        public void Configure(EntityTypeBuilder<Note> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Text)
                .HasMaxLength(400)
                .IsRequired();
            builder.Property(x => x.User)
                .IsRequired();
        }
    }
}
