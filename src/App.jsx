import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, Link, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCart from './components/FloatingCart';
import FavoritesDrawer from './components/FavoritesDrawer';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import Product from './pages/Product';
import Contact from './pages/Contact';
import Suivi from './pages/Suivi';
import Cart from './pages/Cart';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import PolitiqueCookies from './pages/PolitiqueCookies';
import CGV from './pages/CGV';
import CommentCommander from './pages/CommentCommander';
import LivraisonRetours from './pages/LivraisonRetours';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminPayments from './pages/admin/AdminPayments';
import { products as localProducts } from './data/products';
import { getProduct } from './api';

function ShopLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
      <FloatingCart />
      <FavoritesDrawer />
    </div>
  );
}

function ProductRoute() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const local = localProducts.find(p => p.slug === slug) ?? null;
    getProduct(slug)
      .then(p => { if (alive) { setProduct(p); setLoading(false); } })
      .catch(() => { if (alive) { setProduct(local); setLoading(false); } });
    return () => { alive = false; };
  }, [slug]);

  if (loading) {
    return (
      <main className="section-pad" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: '0 auto 18px',
            background: 'var(--sand)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', animation: 'spin 1s linear infinite',
          }}> 
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: '2.5px solid var(--border-2)', borderTopColor: 'var(--terracotta)',
            }} />
          </div>
          <p style={{ color: 'var(--bark-3)', fontSize: 14 }}>Chargement…</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="section-pad" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h1 style={{ fontSize: 26, marginBottom: 12 }}>Produit introuvable</h1>
          <p style={{ color: 'var(--bark-3)', fontSize: 15, marginBottom: 28 }}>
            Ce produit n'existe pas ou a été retiré.
          </p>
          <Link to="/catalogue" className="btn-primary">Voir le catalogue</Link>
        </div>
      </main>
    );
  }

  return <Product product={product} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <FavoritesProvider>
          <Routes>
          {/* Admin (hors chrome boutique) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="commandes" element={<AdminOrders />} />
            <Route path="produits" element={<AdminProducts />} />
            <Route path="paiements" element={<AdminPayments />} />
          </Route>

          {/* Boutique */}
          <Route element={<ShopLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/produit/:slug" element={<ProductRoute />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/suivi-commande" element={<Suivi />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/cookies" element={<PolitiqueCookies />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/comment-commander" element={<CommentCommander />} />
            <Route path="/livraison-retours" element={<LivraisonRetours />} />
          </Route>
        </Routes>
        </FavoritesProvider>
      </CartProvider>
    </BrowserRouter>
  );
}