import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SmoothScroll from './components/motion/SmoothScroll';
import Loader from './components/motion/Loader';
import Cursor from './components/motion/Cursor';
import { Grain, ScrollProgress, PageCurtain } from './components/motion/SiteChrome';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Flavours from './pages/Flavours';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';
import FAQ from './pages/FAQ';
import Policy from './pages/Policy';
import { POLICY_ORDER } from './data/policies';

// Dev-only: renders every media slot (plan.md Phase 2 gate)
const MediaTest = import.meta.env.DEV ? lazy(() => import('./pages/MediaTest')) : null;

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col w-full overflow-x-clip" style={{ background: '#050506', color: '#F6F3ED' }}>
        <SmoothScroll />
        <Loader />
        <Cursor />
        <Grain />
        <ScrollProgress />
        <PageCurtain />
        <Navbar />
        <main className="flex-grow w-full" style={{ paddingTop: '32px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/flavours" element={<Flavours />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<OrderSuccess />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/faq" element={<FAQ />} />
            {POLICY_ORDER.map((slug) => (
              <Route key={slug} path={`/${slug}`} element={<Policy slug={slug} />} />
            ))}
            {MediaTest && <Route path="/media-test" element={<Suspense fallback={null}><MediaTest /></Suspense>} />}
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </Router>
  );
}

export default App;
