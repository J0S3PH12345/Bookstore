import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { deleteBook, fetchBooks } from "../api/BooksAPI";
import Pagination from "../components/Pagination";
import NewBookForm from "../components/NewBookForm";
import EditBookForm from "../components/EditBookForm";

const AdminBooksPage = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] =useState<Book | null>(null);

    useEffect(() => {
        const loadBooks = async () => {
            try {
                // Remove the sortOrder and fetch all books
                const data = await fetchBooks(page, pageSize, []);  // No need for sortOrder now
                console.log("Fetched Data:", data);  // Log the data here
                setBooks(data.books);
                setTotalPages(Math.ceil(data.totalBooks / pageSize));
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        loadBooks();
    }, [page, pageSize]);

    const handleDelete = async (bookID: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this book?');
        if (!confirmDelete) return;

        try{
            await deleteBook(bookID)
            setBooks(books.filter((b) => b.bookID !== bookID))
        } catch (error) {
            alert('Failed to delete book. Please try again')
        };
    };

    if (loading) return <p>Loading books...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div>
            <h1>Admin - Books</h1>

            {!showForm && (
                <button className="btn btn-success mb-3"
                onClick={() => setShowForm(true)}>
                    Add Book
                </button>
            )}

            {showForm && (
                <NewBookForm 
                    onSuccess= {() => {
                        setShowForm(false); 
                        fetchBooks(page, pageSize, []).then((data) => 
                            setBooks(data.books)
                        );
                    }}
                    onCancel={() => setShowForm(false)}
                />
                )}

                {editingBook && (
                    <EditBookForm book={editingBook} onSuccess={()=> {
                        setEditingBook(null);
                        fetchBooks(page, pageSize, []).then((data)=> setBooks(data.books))
                    }}
                    onCancel ={()=> setEditingBook(null)}
                    />
                )}

            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>ISBN</th>
                        <th>Classification</th>
                        <th>Category</th>
                        <th>Page Count</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        books.length > 0 ? (
                            books.map((b) => (
                                <tr key={b.bookID}>
                                    <td>{b.bookID}</td>
                                    <td>{b.title}</td>
                                    <td>{b.author}</td>
                                    <td>{b.publisher}</td>
                                    <td>{b.isbn}</td>
                                    <td>{b.classification}</td>  
                                    <td>{b.category}</td>
                                    <td>{b.pageCount}</td>
                                    <td>{b.price}</td>
                                    <td>
                                        <button className= "btn btn-primary btn-sm w-100 mb-1" onClick={()=> setEditingBook(b)}>Edit</button>
                                        <button className= "btn btn-danger btn-sm w-100" onClick={()=> handleDelete(b.bookID)} >Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={9}>No books available</td></tr>
                        )
                    }
                </tbody>
            </table>
            {/* Pagination component (commented out for now as per your request) */}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setPage(1);
                }}
            />
        </div>
    );
};

export default AdminBooksPage;
