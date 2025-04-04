import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BooksPage from './pages/BooksPage.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CartPage from './pages/CartPage.tsx';
import { CartProvider } from './context/CartContext.tsx';
import AdminBooksPage from './pages/AdminBooksPages.tsx';

function App() {


  return (
    <>
    <CartProvider>
      <Router>
        <Routes>
          <Route path = "/" element={<BooksPage />} />
          <Route path= "/books" element={<BooksPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/adminbooks" element={<AdminBooksPage />} />
          
        </Routes>
      </Router> 
    </CartProvider>

    </>
  )
}

export default App
