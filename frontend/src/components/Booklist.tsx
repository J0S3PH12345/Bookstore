import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import useCart hook

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();
  
  const { cart, addToCart } = useCart(); // Use cart context

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams =
        selectedCategories.length > 0
          ? selectedCategories
              .map((cat) => `bookCategory=${encodeURIComponent(cat)}`)
              .join('&')
          : '';

      try {
        setLoading(true);
        const response = await fetch(
          `https://localhost:5000/api/Book?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}${
            categoryParams ? `&${categoryParams}` : ''
          }`
        );

        if (!response.ok) throw new Error('Failed to fetch books');

        const data = await response.json();
        setBooks(data.books);
        setTotalBooks(data.totalBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, pageSize, sortOrder, selectedCategories]);

  const totalPages = Math.ceil(totalBooks / pageSize);

  // Add to Cart handler
  const handleAddToCart = (book: Book) => {
    const cartItem = {
      bookID: book.bookID,
      quantity: 1,  // Default quantity is 1
      price: book.price,
    };
    addToCart(cartItem); // Add item to cart
    navigate('/cart');  // Navigate to the cart page
  };

  // Calculate total items and total price in the cart
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <div className="container">
      <div className="row">
        {/* Books List */}
        <div className="col-md-8">
          {/* Sorting & Page Size Controls */}
          <label>
            Books per page:
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </label>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            Sort by Title {sortOrder === 'asc' ? '🔼' : '🔽'}
          </button>

          {/* Books List */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            books.map((b) => (
              <div id="bookCard" className="card mb-3" key={b.bookID}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h3 className="card-title">{b.title}</h3>
                      <ul className="list-unstyled">
                        <li><strong>Author: </strong>{b.author}</li>
                        <li><strong>Publisher: </strong>{b.publisher}</li>
                        <li><strong>ISBN: </strong>{b.isbn}</li>
                        <li><strong>Classification: </strong>{b.classification}</li>
                        <li><strong>Category: </strong>{b.category}</li>
                        <li><strong>Number of Pages: </strong>{b.pageCount}</li>
                        <li><strong>Price: </strong>${b.price.toFixed(2)}</li>
                      </ul>
                    </div>
                    <div className="col-md-4 text-right">
                      <button
                        className="btn btn-success"
                        onClick={() => handleAddToCart(b)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Pagination Controls */}
          <div>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <span>
              {' '}
              Page {page} of {totalPages}{' '}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h4>Cart Summary</h4>
              <p>Total Items: {totalItems}</p>
              <p>Total Price: ${totalPrice.toFixed(2)}</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/cart')}
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookList;
