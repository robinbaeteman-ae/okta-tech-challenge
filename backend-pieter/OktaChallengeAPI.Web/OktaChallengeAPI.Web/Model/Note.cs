namespace OktaChallengeAPI.Web.Model
{
    public class Note
    {
        //Not EF Core
        protected Note()
        {  
        }

        public Note(string text, string user)
        {
            Text = text;
            User = user;
        }

        public long Id { get; }
        public string Text { get; set; }
        public string User { get; }
    }
}
