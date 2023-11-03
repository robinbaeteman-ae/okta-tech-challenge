namespace OktaChallengeAPI.Web.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using OktaChallengeAPI.Web.Constants;
    using OktaChallengeAPI.Web.Data;
    using OktaChallengeAPI.Web.Model;

    [ApiController]
    [Route("notes")]
    public class NotesController : ControllerBase
    {
        private readonly NotesDbContext _dbContext;

        public NotesController(NotesDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        [Authorize(Permissions.WriteNotes)]
        [ProducesResponseType(typeof(Note), StatusCodes.Status201Created)]
        public async Task<ActionResult> CreateNote([FromBody] NoteRequest request, CancellationToken cancellationToken)
        {
            var user = this.User.Identity!.Name;

            var note = new Note(request.Text, user);

            _dbContext.Notes.Add(note);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return Created("", note);
        }

        [HttpPut("{id}")]
        [Authorize(Permissions.WriteNotes)]
        [ProducesResponseType(typeof(Note), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> CreateNote(long id, [FromBody] NoteRequest request, CancellationToken cancellationToken)
        {
            var note = await _dbContext.Notes.FindAsync(id);

            if (note == null)
            {
                return NotFound();
            }

            note.Text = request.Text;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Created("", note);
        }

        [HttpGet]
        [Authorize(Permissions.ReadNotes)]
        [ProducesResponseType(typeof(IEnumerable<Note>), StatusCodes.Status200OK)]
        public async Task<ActionResult> ListNotes(CancellationToken cancellationToken)
        {
            var query = _dbContext.Notes.AsQueryable();

            if (!User.IsInRole("Admin"))
            {
                var user = this.User.Identity!.Name;
                query = query.Where(x => x.User == user);
            }

            var notes = await query.ToListAsync(cancellationToken);

            return Ok(notes);
        }
    }
}
