import { Book } from "../types/Book";

interface FetchBooksResponse {
books: Book[];
totalBooks: number;
}

const API_URL = 'https://localhost:5000/api/Book';

export const fetchBooks = async (
page: number,
pageSize: number,
selectedCategories: string[] = []
): Promise<FetchBooksResponse> => {
const params = new URLSearchParams({
page: page.toString(),
pageSize: pageSize.toString(),
});

selectedCategories.forEach(cat => params.append("categories", cat));

const response = await fetch(`${API_URL}?${params.toString()}`);

if (!response.ok) {
throw new Error("Failed to fetch books");
}

return await response.json(); // this will match FetchBooksResponse
};

export const AddBook = async (newBook: Book): Promise<Book> => {
const response = await fetch(`${API_URL}/AddBook`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(newBook),
});

if (!response.ok) {
throw new Error('Failed to add book');
}

return await response.json();
};

export const updateBook = async (bookID: number, updatedBook: Book): Promise<Book> => {
const response = await fetch(`${API_URL}/UpdateBook/${bookID}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(updatedBook),
});

if (!response.ok) {
throw new Error('Failed to update book');
}

return await response.json();
};

export const deleteBook = async (bookID: number): Promise<void> => {
const response = await fetch(`${API_URL}/DeleteBook/${bookID}`, {
method: 'DELETE',
});

if (!response.ok) {
throw new Error('Failed to delete book');
}
};
