using BookstoreProject.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

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

            // Only filter if there are selected categories
            if (bookCategory.Any())
            {
                query = query.Where(c => bookCategory.Contains(c.Category));
            }

            // Sorting Logic - Default to 'asc' if sortOrder is not provided
            query = sortOrder.ToLower() == "asc"
                ? query.OrderBy(b => b.Title)
                : query.OrderByDescending(b => b.Title);

            // Get total number of books
            var totalBooks = query.Count();

            // Get the books for the current page
            var books = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return Ok(new { books, totalBooks });
        }

        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            var bookCategories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(bookCategories);
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }


        [HttpPut("UpdateBook/{bookID}")]
        public IActionResult UpdateProject(int bookID, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookID);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount= updatedBook.PageCount;
            existingBook.Price= updatedBook.Price;

            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();

            return Ok(existingBook);
        }

        [HttpDelete("DeleteBook/{bookID}")]
        public IActionResult DeleteBook(int bookID)
        {
            var book = _bookContext.Books.Find(bookID);

            if (book == null)
            {
                return NotFound(new {message = "Book not found"});
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }
    }
}
