import { SetStateAction, useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import useCart hook
import { fetchBooks } from '../api/BooksAPI';
import Pagination from './Pagination';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { cart, addToCart } = useCart(); // Use cart context

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        // Call fetchBooks without sortOrder
        const data = await fetchBooks(page, pageSize, selectedCategories);
        setBooks(data.books);
        setTotalBooks(data.totalBooks);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [page, pageSize, selectedCategories]); // Re-fetch books when page, pageSize, or selectedCategories change

  if (loading) return <p>Loading books...</p>;
  if (error) return <p className='text-red-500'>Error: {error}</p>;
  const totalPages = Math.max(1, Math.ceil(totalBooks / pageSize));

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
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(newSize: SetStateAction<number>) => {
              setPageSize(newSize);
              setPage(1);
            }}
          />
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
