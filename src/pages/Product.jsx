import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Flame, ShieldCheck, ChevronRight, Check } from 'lucide-react';
import { products } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { cn } from '../lib/utils';
import ProductCard from '../components/ProductCard';
import { getFlavour } from '../data/flavours';
import { useFlavourTint } from '../lib/useFlavourTint';
import Pack3DViewer from '../components/three/Pack3DViewer';

export default function Product() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [addedNotice, setAddedNotice] = useState(false);
  const { addItem, openCart } = useCartStore();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
  }, [id]);

  const product = products.find(p => p.id === id);
  const flavour = getFlavour(id);
  useFlavourTint(flavour);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-[#070708] text-[#F6F3ED]">
        <div className="text-center">
          <h1 className="text-4xl font-display font-black uppercase mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-[#E52B32] hover:underline">Return to Shop</Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    openCart();
  };

  // 3D pack viewer prop
  const flavourData = {
    id: product.id,
    name: product.name,
    img: product.image,
    crop: flavour.crop,
    accent: flavour.accent,
    packColor: flavour.packColor,
  };

  return (
    <div className="pt-32 md:pt-36 pb-24 bg-[#050506] min-h-screen text-[#F6F3ED]">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#B7B5B0] font-medium mb-8">
          <Link to="/shop" className="hover:text-[#E52B32] flex items-center gap-1 transition-colors">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
          <ChevronRight size={14} />
          <span className="text-[#F6F3ED]">{product.name}</span>
        </div>

        {/* Product Hero: 3D Pack on Left, Product Details on Right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-24 items-center">
          
          {/* G01 Live 3D Interactive Pack */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="w-full rounded-[2.5rem] bg-[#0D0D10] border border-white/[0.08] p-4 md:p-6 relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 55%, color-mix(in srgb, var(--flavour) 30%, transparent) 0%, transparent 72%)' }}
              />
              <Pack3DViewer flavour={flavourData} />

              {/* Floating Spice Badge */}
              <div className="absolute top-6 right-6 z-20 bg-[#070708]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 flex items-center gap-2">
                <Flame size={15} className="text-flavour fill-flavour" />
                <span className="font-bold text-xs uppercase tracking-wider">Spice {product.spiceLevel}/5</span>
              </div>
            </div>
          </motion.div>

          {/* Details Side */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap gap-2 mb-4">
                {product.features.map((feature, i) => (
                  <span key={i} className="bg-[#141416] border border-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 text-[#F6F3ED]">
                    <ShieldCheck size={12} className="text-flavour" /> {feature}
                  </span>
                ))}
              </div>
              
              <h1 className="font-cine font-extrabold uppercase tracking-[-0.035em] leading-[0.9] mb-5 text-[#F6F3ED]" style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}>
                {product.name}
              </h1>
              
              <div className="text-3xl font-display font-black mb-4 text-[#D9B779]">
                ₹{product.price}
                <span className="text-xs uppercase tracking-wider text-[#B7B5B0] font-sans ml-3 font-semibold">100g Pack</span>
              </div>
              
              <p className="text-base md:text-lg text-[#B7B5B0] leading-relaxed font-sans">
                {product.description}
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4 pt-6 border-t border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-[#141416] border border-white/10 rounded-full p-1.5 h-14 w-36">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="flex-1 text-center font-bold text-base">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 h-14 bg-[#141416] border border-white/20 hover:border-white/40 text-[#F6F3ED] rounded-full font-bold uppercase tracking-wider text-xs hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  {addedNotice ? (
                    <>
                      <Check size={16} className="text-[#3FBD79]" /> Added to Cart!
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>

              <button 
                onClick={handleBuyNow}
                className="w-full h-14 bg-flavour glow-flavour rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ color: 'var(--flavour-ink)' }}
              >
                Buy it Now — ₹{product.price * quantity}
              </button>
              
              <div className="flex justify-center gap-6 text-xs font-medium text-[#B7B5B0] pt-2">
                <span>Free shipping over ₹500</span>
                <span aria-hidden="true">·</span>
                <span>100% atta · No palm oil</span>
              </div>
            </motion.div>

            {/* Product Tabs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-8 border-t border-white/10"
            >
              <div className="flex gap-6 border-b border-white/10 mb-5 font-display uppercase tracking-wider font-bold text-sm">
                <button 
                  onClick={() => setActiveTab('ingredients')}
                  className={cn("pb-2 transition-colors border-b-2", activeTab === 'ingredients' ? "border-flavour text-[#F6F3ED]" : "border-transparent text-[#B7B5B0] hover:text-[#F6F3ED]")}
                >
                  Ingredients
                </button>
                <button 
                  onClick={() => setActiveTab('nutrition')}
                  className={cn("pb-2 transition-colors border-b-2", activeTab === 'nutrition' ? "border-flavour text-[#F6F3ED]" : "border-transparent text-[#B7B5B0] hover:text-[#F6F3ED]")}
                >
                  Nutrition
                </button>
                <button 
                  onClick={() => setActiveTab('taste')}
                  className={cn("pb-2 transition-colors border-b-2", activeTab === 'taste' ? "border-flavour text-[#F6F3ED]" : "border-transparent text-[#B7B5B0] hover:text-[#F6F3ED]")}
                >
                  Taste Profile
                </button>
              </div>
              
              <div className="min-h-[120px] text-[#B7B5B0] leading-relaxed text-sm">
                <AnimatePresence mode="wait">
                  {activeTab === 'ingredients' && (
                    <motion.p key="ingredients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {product.ingredients}
                    </motion.p>
                  )}
                  {activeTab === 'nutrition' && (
                    <motion.div key="nutrition" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="grid grid-cols-2 gap-y-3 max-w-sm">
                        <div className="flex justify-between border-b border-white/5 pb-1.5"><span>Energy</span> <span className="font-bold text-[#F6F3ED]">{product.nutritionalInfo.energy}</span></div>
                        <div className="flex justify-between border-b border-white/5 pb-1.5"><span>Protein</span> <span className="font-bold text-[#D9B779]">{product.nutritionalInfo.protein}</span></div>
                        <div className="flex justify-between border-b border-white/5 pb-1.5"><span>Carbs</span> <span className="font-bold text-[#F6F3ED]">{product.nutritionalInfo.carbs}</span></div>
                        <div className="flex justify-between border-b border-white/5 pb-1.5"><span>Fat (Sunflower)</span> <span className="font-bold text-[#F6F3ED]">{product.nutritionalInfo.fat}</span></div>
                        <div className="flex justify-between border-b border-white/5 pb-1.5"><span>Dietary Fiber</span> <span className="font-bold text-[#F6F3ED]">{product.nutritionalInfo.fiber}</span></div>
                      </div>
                      <p className="text-[11px] text-[#B7B5B0]/60 mt-3">*Per 100g standard serving</p>
                    </motion.div>
                  )}
                  {activeTab === 'taste' && (
                    <motion.p key="taste" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-base font-medium text-[#F6F3ED]">
                      {product.tasteProfile}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        <div className="py-16 border-t border-white/10">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-black uppercase tracking-wider">Explore More Flavours</h2>
            <Link to="/shop" className="text-[#E52B32] font-bold uppercase tracking-wider text-xs hover:underline">View All Flavours</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
