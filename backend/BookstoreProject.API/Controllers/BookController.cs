using BookstoreProject.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookstoreProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;
        public BookController(BookDbContext temp)
        {
            _bookContext = temp;
        }


        [HttpGet]
        public IActionResult GetBooks(int page = 1, int pageSize = 5, string sortOrder = "asc", [FromQuery] List<string> bookCategory = null)
        {
            // Ensure bookCategory is initialized to prevent null reference issues
            bookCategory ??= new List<string>();

            var query = _bookContext.Books.AsQueryable();

            if (bookCategory.Any()) // Only filter if there are selected categories
            {
                query = query.Where(c => bookCategory.Contains(c.Category));
            }

            // Sorting Logic
            query = sortOrder == "asc"
                ? query.OrderBy(b => b.Title)
                : query.OrderByDescending(b => b.Title);

            var totalBooks = query.Count();
            var books = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return Ok(new { books, totalBooks });
        }


        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories ()
        {
            var bookCategories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();
            return Ok(bookCategories);

        }
    }
}
