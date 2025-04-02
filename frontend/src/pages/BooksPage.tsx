import { useState } from 'react';
import Booklist from '../components/Booklist';
import CategoryFilter from '../components/CategoryFilter';
import WelcomeBand from '../components/WelcomeBand';

function BooksPage() {
const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

return (
<div>
    <div className="container">
    <div className="row bg-primary text-white">
        <WelcomeBand />
    </div>
    <div className="row">
        <div className="col-md-3">
        <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
        />
        </div>
        <div className="col-md-9">
        <Booklist selectedCategories={selectedCategories} />
        </div>
    </div>
    </div>
</div>
);
}

export default BooksPage;
