import { useEffect, useState } from 'react';
import Booklist from '../components/Booklist';

const BooksPage = () => {
const [categories, setCategories] = useState<string[]>([]);
const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

// Fetch all available categories on mount
useEffect(() => {
const loadCategories = async () => {
    const res = await fetch('http://localhost:5000/api/Book/GetBookCategories');
    const data = await res.json();
    setCategories(data);
};

loadCategories();
}, []);

// Handle checkbox changes
const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const value = e.target.value;
const checked = e.target.checked;

if (checked) {
    setSelectedCategories((prev) => [...prev, value]);
} else {
    setSelectedCategories((prev) => prev.filter((cat) => cat !== value));
}
};

return (
<div className="container mt-4">
    <h2>Filter by Category</h2>
    <div className="mb-3">
    {categories.map((cat) => (
        <div key={cat} className="form-check">
        <input
            className="form-check-input"
            type="checkbox"
            value={cat}
            checked={selectedCategories.includes(cat)}
            onChange={handleCategoryChange}
            id={`cat-${cat}`}
        />
        <label className="form-check-label" htmlFor={`cat-${cat}`}>
            {cat}
        </label>
        </div>
    ))}
    </div>

    {/* Pass selectedCategories to BookList */}
    <Booklist selectedCategories={selectedCategories} />
</div>
);
};

export default BooksPage;
