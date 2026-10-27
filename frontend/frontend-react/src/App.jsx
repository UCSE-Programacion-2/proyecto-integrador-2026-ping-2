import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='catalogo' element={<Catalog />} />
          <Route path='producto/:id' element={<ProductDetail />} />
          <Route path='login' element={<Login />} />
          <Route path='registro' element={<Register />} />
          <Route path='carrito' element={<Cart />} />
          <Route path='checkout' element={<Checkout />} />
          <Route element={<ProtectedRoute requireAdmin />}>
            <Route path='admin' element={<Admin />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
