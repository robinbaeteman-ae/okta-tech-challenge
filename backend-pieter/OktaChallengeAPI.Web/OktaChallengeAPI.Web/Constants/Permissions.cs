namespace OktaChallengeAPI.Web.Constants
{
    public class Permissions
    {
        public const string ReadNotes = "read:notes";
        public const string WriteNotes = "write:notes";

        public static readonly string[] All = { ReadNotes, WriteNotes };
    }
}
