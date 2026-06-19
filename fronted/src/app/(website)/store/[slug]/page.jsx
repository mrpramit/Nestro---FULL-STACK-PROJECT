"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchProducts } from "@/utils/api";
import { toast } from "sonner";
import { FiMinus, FiPlus, FiShoppingBag, FiHeart, FiCheck, FiTruck, FiShield, FiRotateCcw } from "react-icons/fi";

// Reusable SVG product illustration matching the Store catalog design
const ProductIllustration = ({ name = "", category = "" }) => {
  const cName = category.toLowerCase();
  const pName = name.toLowerCase();

  if (cName.includes("sofa") || pName.includes("sofa") || pName.includes("loveseat") || pName.includes("sectional")) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-3xl min-h-[300px] md:min-h-[450px]">
        <svg className="w-64 h-48 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 120 80">
          <rect x="15" y="20" width="90" height="30" rx="6" />
          <rect x="22" y="25" width="36" height="20" rx="3" fill="#C4A484" />
          <rect x="62" y="25" width="36" height="20" rx="3" fill="#C4A484" />
          <rect x="10" y="30" width="12" height="25" rx="4" />
          <rect x="98" y="30" width="12" height="25" rx="4" />
          <rect x="15" y="48" width="90" height="10" rx="2" />
          <line x1="20" y1="58" x2="20" y2="65" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
          <line x1="100" y1="58" x2="100" y2="65" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (
    cName.includes("storage") ||
    cName.includes("cabinet") ||
    cName.includes("unit") ||
    pName.includes("bookcase") ||
    pName.includes("cabinet") ||
    pName.includes("stand") ||
    pName.includes("wardrobe")
  ) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-3xl min-h-[300px] md:min-h-[450px]">
        <svg className="w-48 h-64 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 80 100">
          <rect x="15" y="10" width="50" height="80" rx="4" fill="none" stroke="#8C6239" strokeWidth="4" />
          <line x1="15" y1="32" x2="65" y2="32" stroke="#8C6239" strokeWidth="4" />
          <line x1="15" y1="54" x2="65" y2="54" stroke="#8C6239" strokeWidth="4" />
          <line x1="15" y1="76" x2="65" y2="76" stroke="#8C6239" strokeWidth="4" />
          <rect x="20" y="18" width="8" height="10" rx="1" fill="#C4A484" />
          <rect x="30" y="16" width="6" height="12" rx="1" fill="#D2C4B9" />
          <rect x="52" y="38" width="10" height="12" rx="1" fill="#C4A484" />
          <circle cx="30" cy="70" r="4" fill="#D2C4B9" />
        </svg>
      </div>
    );
  }

  if (cName.includes("table") || pName.includes("table") || pName.includes("desk") || pName.includes("coffee")) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-3xl min-h-[300px] md:min-h-[450px]">
        <svg className="w-56 h-48 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 100 80">
          <ellipse cx="50" cy="35" rx="35" ry="12" />
          <rect x="42" y="42" width="6" height="22" rx="1" />
          <rect x="52" y="42" width="6" height="22" rx="1" />
          <ellipse cx="50" cy="64" rx="16" ry="5" />
        </svg>
      </div>
    );
  }

  if (cName.includes("chair") || pName.includes("chair") || pName.includes("armchair") || pName.includes("pouf")) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-3xl min-h-[300px] md:min-h-[450px]">
        <svg className="w-48 h-48 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 100 80">
          <rect x="25" y="15" width="50" height="40" rx="10" />
          <rect x="18" y="30" width="10" height="25" rx="4" />
          <rect x="72" y="30" width="10" height="25" rx="4" />
          <rect x="25" y="40" width="50" height="15" rx="4" fill="#C4A484" />
          <line x1="32" y1="55" x2="28" y2="66" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
          <line x1="68" y1="55" x2="72" y2="66" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-3xl min-h-[300px] md:min-h-[450px]">
      <svg className="w-56 h-48 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 100 80">
        <rect x="20" y="20" width="60" height="40" rx="6" />
        <rect x="28" y="25" width="44" height="15" rx="2" fill="#C4A484" />
        <line x1="24" y1="60" x2="24" y2="68" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
        <line x1="76" y1="60" x2="76" y2="68" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
};

const MOCK_PRODUCTS = [
  {
    _id: "p-1",
    name: "Classic Velvet Chesterfield Sofa",
    categoryId: { name: "SOFAS", slug: "sofas" },
    roomId: { name: "Living Room", slug: "living-room" },
    salePrice: 86400,
    originalPrice: 108000,
    discount: 20,
    rating: 5,
    reviewsCount: 16,
    material: "Velvet",
    color: "Dark Brown/Charcoal",
    stock: true,
    slug: "classic-velvet-chesterfield-sofa",
    shortDescription: "A timeless masterpiece featuring tufted velvet upholstery and elegant rolled arms. Hand-crafted to bring classical comfort to modern spaces.",
    description: "The Classic Velvet Chesterfield Sofa represents the ultimate in heritage style. Deep button-tufting details accent its luxurious velvet exterior, while dense polyurethane foam padding ensures structural integrity and comfort that lasts. Framed with robust, solid hardwood rails and accented by beautifully turned oak feet.",
    dimensions: { width: 220, height: 78, depth: 95 },
    weight: 62
  },
  {
    _id: "p-2",
    name: "Scandinavian 3-Seater Sofa",
    categoryId: { name: "SOFAS", slug: "sofas" },
    roomId: { name: "Living Room", slug: "living-room" },
    salePrice: 57000,
    originalPrice: 68400,
    discount: 17,
    rating: 4.8,
    reviewsCount: 79,
    material: "Linen",
    color: "Slate Blue",
    stock: true,
    slug: "scandinavian-3-seater-sofa",
    shortDescription: "Minimalist aesthetic meets exceptional everyday comfort. Upholstered in premium linen-blend fabric with natural wood legs.",
    description: "Embrace nordic clean lines and functional design. This Scandinavian 3-Seater features high-resilience foam seat cushions wrapped in heavy-duty weave polyester-linen fabric. Solid oak legs lend stability and height, making it visually light and extremely practical.",
    dimensions: { width: 205, height: 82, depth: 88 },
    weight: 48
  },
  {
    _id: "p-3",
    name: "Luxury Leather L-Shape Sectional",
    categoryId: { name: "SOFAS", slug: "sofas" },
    roomId: { name: "Living Room", slug: "living-room" },
    salePrice: 216000,
    originalPrice: 256000,
    discount: 16,
    rating: 4.9,
    reviewsCount: 86,
    material: "Leather",
    color: "Dark Brown/Charcoal",
    stock: true,
    slug: "luxury-leather-l-shape-sectional",
    shortDescription: "Expansive sectional sofa wrapped in top-grain aniline leather. Configured with a left-facing chaise for optimal relaxation.",
    description: "Make a statement with the Luxury Leather Sectional. Hand-stitched with top-grain Italian leather, this L-shape sectional develops a beautiful unique patina over time. High-density pocket spring cores guarantee supportive seating, while steel-reinforced frames provide long-term performance.",
    dimensions: { width: 310, height: 80, depth: 165 },
    weight: 110
  },
  {
    _id: "p-4",
    name: "Ember Velvet 3-Seater",
    categoryId: { name: "SOFAS & SECTIONALS", slug: "sofas" },
    roomId: { name: "Living Room", slug: "living-room" },
    salePrice: 89000,
    originalPrice: 108000,
    discount: 18,
    badge: "BESTSELLER",
    rating: 5,
    reviewsCount: 48,
    material: "Velvet",
    color: "Dark Brown/Charcoal",
    stock: true,
    slug: "ember-velvet-3-seater",
    shortDescription: "Sultry velvet curves wrapped around a kiln-dried eucalyptus framework. Perfectly proportioned for dynamic living spaces.",
    description: "Deep, comfortable seating designed with premium velvet fabric. The Ember Velvet 3-Seater is structured for optimal seating ergonomics, incorporating sinuous spring suspension beneath thick plush cushions.",
    dimensions: { width: 215, height: 80, depth: 90 },
    weight: 54
  },
  {
    _id: "p-5",
    name: "Natura Dining Table",
    categoryId: { name: "DINING", slug: "dining" },
    roomId: { name: "Dining Room", slug: "dining-room" },
    salePrice: 124000,
    originalPrice: 155000,
    discount: 20,
    rating: 5,
    reviewsCount: 62,
    material: "Solid Wood",
    color: "Medium Brown",
    stock: true,
    slug: "natura-dining-table",
    shortDescription: "Stunning solid wood dining table showing off beautiful organic grain flows. Comfortably seats up to 8 guests.",
    description: "Crafted from seasoned solid walnut wood, the Natura Dining Table highlights the natural character of timber with knots and unique grain structures. Protected with a hardwearing matte polyurethane topcoat to endure daily spills.",
    dimensions: { width: 200, height: 76, depth: 95 },
    weight: 75
  },
  {
    _id: "p-6",
    name: "Terra Coffee Table",
    categoryId: { name: "TABLES", slug: "tables" },
    roomId: { name: "Living Room", slug: "living-room" },
    salePrice: 38000,
    discount: 0,
    rating: 4.2,
    reviewsCount: 29,
    material: "Marble",
    color: "Off-white/Cream",
    stock: true,
    slug: "terra-coffee-table",
    shortDescription: "Sculptural round coffee table with an authentic white marble top slab and a fluted wooden base.",
    description: "An elegant centerpiece for any living layout. The polished white Carrara marble top boasts natural grey veining, resting securely on a handcrafted fluted oak veneer column.",
    dimensions: { width: 90, height: 40, depth: 90 },
    weight: 40
  },
  {
    _id: "p-7",
    name: "Aura Bouclé Armchair",
    categoryId: { name: "ACCENT CHAIRS", slug: "chairs" },
    roomId: { name: "Living Room", slug: "living-room" },
    salePrice: 54000,
    discount: 0,
    rating: 4.9,
    reviewsCount: 94,
    material: "Linen",
    color: "Slate Blue",
    stock: true,
    slug: "aura-boucle-armchair",
    shortDescription: "Cozy armchair wrapped in premium textured bouclé-style linen. Features a modern organic swivel silhouette.",
    description: "Wrap yourself in absolute comfort. The Aura features a fully cushioned wrap-around backrest with a solid wood swivel platform underneath, allowing 360-degree rotation.",
    dimensions: { width: 85, height: 75, depth: 80 },
    weight: 24
  },
  {
    _id: "p-8",
    name: "Walnut Media Console",
    categoryId: { name: "MEDIA & TV UNITS", slug: "media" },
    roomId: { name: "Living Room", slug: "living-room" },
    salePrice: 67000,
    originalPrice: 86000,
    discount: 22,
    rating: 4.5,
    reviewsCount: 37,
    material: "Solid Wood",
    color: "Dark Brown/Charcoal",
    stock: true,
    slug: "walnut-media-console",
    shortDescription: "Mid-century inspired media storage console. Engineered with slatted sliding doors and wire management ports.",
    description: "Clean design meets home entertainment storage. Constructed using American walnut veneer, this console offers spacious cabinets, soft-close drawers, and adjustable internal shelves.",
    dimensions: { width: 180, height: 55, depth: 45 },
    weight: 52
  },
  {
    _id: "p-9",
    name: "Linen Wardrobe Cabinet",
    categoryId: { name: "BEDROOM", slug: "bedroom" },
    roomId: { name: "Bedroom", slug: "bedroom" },
    salePrice: 118000,
    discount: 0,
    rating: 5,
    reviewsCount: 19,
    material: "Linen",
    color: "Sand",
    stock: false,
    slug: "linen-wardrobe-cabinet",
    shortDescription: "Elegant wardrobe wrapped in soft linen weave panels. Integrated with brass accents and interior lighting.",
    description: "A gorgeous freestanding storage unit. Features dual linen-upholstered doors opening to reveal hanging rails, built-in dresser drawers, and high-quality brass pulls.",
    dimensions: { width: 120, height: 200, depth: 60 },
    weight: 88
  },
  {
    _id: "p-10",
    name: "Mid-Century Modern Loveseat",
    categoryId: { name: "SOFAS", slug: "sofas" },
    roomId: { name: "Living Room", slug: "living-room" },
    salePrice: 50316,
    originalPrice: 63000,
    discount: 20,
    rating: 4.7,
    reviewsCount: 15,
    material: "Velvet",
    color: "Sand",
    stock: true,
    slug: "mid-century-modern-loveseat",
    shortDescription: "Charming two-seater sofa perfect for compact spaces. Retro flared wooden peg legs and button-tufted backrest.",
    description: "Vintage aesthetics paired with modern performance materials. Dense foam padding wrapped in durable sand-coloured velvet fabric stands up to high-traffic utility while remaining soft.",
    dimensions: { width: 160, height: 80, depth: 85 },
    weight: 38
  },
  {
    _id: "p-11",
    name: "Platform King Bed with Headboard",
    categoryId: { name: "BEDS", slug: "beds" },
    roomId: { name: "Bedroom", slug: "bedroom" },
    salePrice: 79112,
    originalPrice: 96000,
    discount: 20,
    rating: 5,
    reviewsCount: 39,
    material: "Solid Wood",
    color: "Sand",
    stock: true,
    slug: "platform-king-bed-with-headboard",
    shortDescription: "Minimalist oak frame platform bed featuring a woven upholstered panel headboard.",
    description: "Bring earthy warmth to the master bedroom. Built from selected light oak wood with a sturdy slats system that eliminates the need for box springs. Features a padded linen headboard.",
    dimensions: { width: 210, height: 110, depth: 220 },
    weight: 80
  },
  {
    _id: "p-12",
    name: "Tufted Velvet Storage Queen Bed",
    categoryId: { name: "BEDS", slug: "beds" },
    roomId: { name: "Bedroom", slug: "bedroom" },
    salePrice: 79128,
    originalPrice: 97200,
    discount: 20,
    rating: 4.8,
    reviewsCount: 27,
    material: "Velvet",
    color: "Slate Blue",
    stock: true,
    slug: "tufted-velvet-storage-queen-bed",
    shortDescription: "Elegant velvet upholstered bed featuring an easy-lift hydraulic storage container underneath.",
    description: "Luxurious style and intelligent utility combined. The gas-lift hydraulic system raises the mattress deck seamlessly to reveal large storage compartments for blankets and out-of-season wear.",
    dimensions: { width: 170, height: 125, depth: 215 },
    weight: 95
  },
  {
    _id: "p-13",
    name: "Minimalist Oak Desk",
    categoryId: { name: "TABLES", slug: "tables" },
    roomId: { name: "Home Office", slug: "home-office" },
    salePrice: 24500,
    discount: 0,
    rating: 4.3,
    reviewsCount: 12,
    material: "Solid Wood",
    color: "Sand",
    stock: true,
    slug: "minimalist-oak-desk",
    shortDescription: "Clean home office writing desk. Includes two slim drawer compartments and integrated cord management.",
    description: "Design simplicity to help organize your focus. Formed with solid oak wood legs and oak veneers, offering a durable work surface for laptops and notebooks.",
    dimensions: { width: 120, height: 75, depth: 60 },
    weight: 28
  },
  {
    _id: "p-14",
    name: "Leather Office Chair",
    categoryId: { name: "ACCENT CHAIRS", slug: "chairs" },
    roomId: { name: "Home Office", slug: "home-office" },
    salePrice: 18900,
    discount: 0,
    rating: 4.6,
    reviewsCount: 22,
    material: "Leather",
    color: "Dark Slate/Black",
    stock: true,
    slug: "leather-office-chair",
    shortDescription: "Classic adjustable swivel desk chair upholstered in supple brown distressed leather.",
    description: "Ergonomic support meeting retro mid-century executive design. Height adjustable pneumatic base with chrome legs and smooth rolling caster wheels.",
    dimensions: { width: 65, height: 95, depth: 65 },
    weight: 16
  },
  {
    _id: "p-15",
    name: "Glass Display Cabinet",
    categoryId: { name: "STORAGE", slug: "storage" },
    roomId: { name: "Dining Room", slug: "dining-room" },
    salePrice: 58000,
    discount: 0,
    rating: 5,
    reviewsCount: 14,
    material: "Solid Wood",
    color: "Dark Slate/Black",
    stock: true,
    slug: "glass-display-cabinet",
    shortDescription: "Magnificent dining showcase unit with tempered glass windows and solid oak wood frame.",
    description: "Display fine dinnerware or precious collectibles. The premium dark charcoal cabinet houses 4 glass shelves backed by an optional ambient warm LED strip system.",
    dimensions: { width: 90, height: 185, depth: 40 },
    weight: 70
  }
];

const colorSwatches = [
  { name: "Off-white/Cream", value: "#FAF7F2", borderClass: "border-gray-300" },
  { name: "Dark Slate/Black", value: "#2C1C18", borderClass: "border-transparent" },
  { name: "Medium Brown", value: "#8C6239", borderClass: "border-transparent" },
  { name: "Slate Blue", value: "#6A7D8C", borderClass: "border-transparent" },
  { name: "Sand", value: "#D6C5B3", borderClass: "border-transparent" },
  { name: "Dark Brown/Charcoal", value: "#3E2A24", borderClass: "border-transparent" }
];

const materialsList = ["Solid Wood", "Velvet", "Linen", "Marble", "Leather"];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        // Fetch from API with slug filter
        const response = await fetchProducts({ slug });
        if (response.success && response.data.length > 0) {
          const fetchedProd = response.data[0];
          
          // Map reviews count and rating if not present in DB
          const processedProd = {
            ...fetchedProd,
            reviewsCount: fetchedProd.reviewsCount || Math.floor(Math.random() * 80) + 15,
            rating: fetchedProd.rating || 5,
            material: fetchedProd.material || (fetchedProd.name.includes("Velvet") ? "Velvet" : "Solid Wood"),
            color: fetchedProd.color || "Medium Brown",
            dimensions: fetchedProd.dimensions || { width: 180, height: 75, depth: 90 },
            weight: fetchedProd.weight || 45,
            shortDescription: fetchedProd.shortDescription || "A beautiful handmade addition to your home furniture lineup. Engineered for high performance comfort and sleek premium looks.",
            description: fetchedProd.description || "Every detail has been crafted to perfection by expert furniture makers. Using sustainable timbers and heavy-duty, certified fabrics, this piece is built to elevate your daily living environment with classic textures and structural resilience.",
          };
          setProduct(processedProd);
          setSelectedColor(processedProd.color);
          setSelectedMaterial(processedProd.material);
          setActiveImage(processedProd.thumbnail);
        } else {
          // Fallback to local mock array
          const mock = MOCK_PRODUCTS.find((p) => p.slug === slug);
          if (mock) {
            setProduct(mock);
            setSelectedColor(mock.color);
            setSelectedMaterial(mock.material);
            setActiveImage(mock.thumbnail || null);
          }
        }
      } catch (error) {
        console.error("Error loading product details:", error);
        const mock = MOCK_PRODUCTS.find((p) => p.slug === slug);
        if (mock) {
          setProduct(mock);
          setSelectedColor(mock.color);
          setSelectedMaterial(mock.material);
          setActiveImage(mock.thumbnail || null);
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-40 gap-3 bg-[#FAF7F2]">
        <div className="w-10 h-10 border-4 border-[#8C6239] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-bold text-[#8C6239] tracking-wider uppercase">Loading product details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-32 text-center px-4 bg-[#FAF7F2]">
        <h2 className="text-2xl font-bold text-[#281C19]">Product Not Found</h2>
        <p className="text-sm text-[#8A7973] mt-2">The product you are looking for does not exist or has been removed.</p>
        <Link
          href="/store"
          className="mt-6 bg-[#8C6239] text-[#FAF7F2] hover:bg-[#724E2B] transition-all px-6 py-2.5 rounded-lg text-xs font-bold"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  const discountPct = product.discount || (product.originalPrice ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100) : 0);
  const ratingStars = Math.round(product.rating || 5);
  const isOutOfStock = product.stock === false;

  const handleAddToCart = () => {
    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-bold text-sm text-[#281C19]">Added to Cart!</span>
        <span className="text-xs text-[#8A7973]">
          {quantity}x {product.name} ({selectedColor}, {selectedMaterial})
        </span>
      </div>
    );
  };

  // Combine thumbnail and product images for the gallery
  const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-widest text-[#8A7973] uppercase mb-8 md:mb-12">
          <Link href="/" className="hover:text-[#8C6239] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/store" className="hover:text-[#8C6239] transition-colors">Store</Link>
          <span>/</span>
          <span className="text-[#8C6239] truncate max-w-[150px] md:max-w-xs">{product.name}</span>
        </nav>

        {/* Detail Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Images & Visual Representation */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Visual Frame */}
            <div className="aspect-[4/3] w-full bg-white border border-[#EFE8DF] rounded-3xl overflow-hidden shadow-sm relative flex items-center justify-center p-6">
              {discountPct > 0 && (
                <span className="absolute top-6 left-6 text-[10px] font-extrabold text-[#FAF7F2] bg-[#8C6239] px-3 py-1.5 rounded tracking-widest uppercase z-10">
                  -{discountPct}% OFF
                </span>
              )}
              {isOutOfStock && (
                <span className="absolute top-6 left-6 text-[10px] font-extrabold text-white bg-red-600 px-3 py-1.5 rounded tracking-widest uppercase z-10">
                  Sold Out
                </span>
              )}

              {/* Main Image or Illustration */}
              {activeImage && activeImage.startsWith("http") ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="max-h-[90%] max-w-[90%] object-contain transform hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full">
                  <ProductIllustration name={product.name} category={product.categoryId?.name || ""} />
                </div>
              )}
            </div>

            {/* Gallery Thumbnails (only shown if multiple images exist) */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 bg-white border rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 cursor-pointer transition-all ${
                      activeImage === img
                        ? "border-[#8C6239] ring-2 ring-[#8C6239]/20"
                        : "border-[#EFE8DF] hover:border-[#8C6239]/60"
                    }`}
                  >
                    {img.startsWith("http") ? (
                      <img src={img} alt={`Thumbnail ${index}`} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-[10px] font-bold text-[#8A7973]">Image {index + 1}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Configuration & Purchasing Info */}
          <div className="lg:col-span-5 bg-white border border-[#EFE8DF] rounded-[32px] p-6 md:p-8 shadow-sm space-y-6 md:space-y-8">
            
            {/* Title / Badges */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-[#8C6239] tracking-[0.25em] uppercase block">
                {product.categoryId?.name || "Premium Collection"}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#281C19] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Review Stars Row */}
              <div className="flex items-center gap-2 pt-1.5 text-xs text-[#8A7973]">
                <div className="flex text-sm tracking-tighter">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span key={idx} className={idx < ratingStars ? "text-[#8C6239]" : "text-gray-200"}>★</span>
                  ))}
                </div>
                <span className="font-bold text-[#281C19]">{product.rating}</span>
                <span>•</span>
                <span className="hover:text-[#8C6239] transition-colors cursor-pointer">{product.reviewsCount} reviews</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="border-y border-[#EFE8DF]/60 py-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#281C19]">
                ₹{product.salePrice?.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && product.originalPrice > product.salePrice && (
                <span className="text-base text-[#8A7973] line-through">
                  ₹{product.originalPrice?.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs md:text-sm text-[#8A7973] leading-relaxed">
              {product.shortDescription}
            </p>

            {/* OPTION: Material Choice */}
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-widest block">
                Material: <span className="text-[#8C6239] font-black">{selectedMaterial}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {materialsList.map((material) => (
                  <button
                    key={material}
                    onClick={() => setSelectedMaterial(material)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedMaterial === material
                        ? "bg-[#3E2A24] text-white shadow-sm"
                        : "bg-[#FAF7F2] border border-[#EFE8DF] text-[#8A7973] hover:border-[#8C6239] hover:text-[#8C6239]"
                    }`}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>

            {/* OPTION: Color Selection Swatches */}
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-widest block">
                Color: <span className="text-[#8C6239] font-black">{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-3">
                {colorSwatches.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border cursor-pointer relative flex items-center justify-center transition-all ${
                        color.borderClass
                      } ${isSelected ? "ring-2 ring-[#8C6239] ring-offset-2 scale-110" : "hover:scale-110"}`}
                      style={{ backgroundColor: color.value }}
                    >
                      {isSelected && (
                        <FiCheck className={`text-xs ${
                          color.name.includes("Off-white") ? "text-[#8C6239]" : "text-white"
                        }`} />
                      )}
                    </button>
                  );
                })}
                {/* Fallback swatch if the product color is custom and not in swatches list */}
                {!colorSwatches.some(s => s.name === selectedColor) && selectedColor && (
                  <button
                    title={selectedColor}
                    className="px-3.5 py-1.5 rounded-full border border-[#8C6239] text-[10px] font-bold text-[#8C6239] bg-[#FAF7F2] scale-110 relative flex items-center gap-1.5"
                  >
                    <FiCheck className="text-[10px]" /> {selectedColor}
                  </button>
                )}
              </div>
            </div>

            {/* Quantity Selector & Add to Cart Action Row */}
            <div className="space-y-4 pt-2">
              <div className="flex gap-4 items-center">
                
                {/* Quantity adjuster */}
                <div className="flex items-center bg-[#FAF7F2] border border-[#EFE8DF] rounded-xl px-2.5 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-1 hover:text-[#8C6239] text-[#8A7973] disabled:opacity-40 cursor-pointer"
                  >
                    <FiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-extrabold text-[#281C19] w-8 text-center select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock}
                    className="p-1 hover:text-[#8C6239] text-[#8A7973] cursor-pointer"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Trigger */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 bg-[#8C6239] hover:bg-[#724E2B] text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#8C6239]/10 active:scale-[0.98] transition-all py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiShoppingBag className="w-4 h-4" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>

                {/* Wishlist button */}
                <button className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#EFE8DF] hover:border-[#8C6239] hover:text-[#8C6239] transition-all flex items-center justify-center text-[#8A7973] cursor-pointer hover:scale-105 active:scale-95">
                  <FiHeart className="w-4 h-4" />
                </button>

              </div>
            </div>

            {/* Extra product confidence specifications list */}
            <div className="border-t border-[#EFE8DF]/60 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs text-[#8A7973]">
                <FiTruck className="text-[#8C6239] w-4 h-4 flex-shrink-0" />
                <span>Free White Glove delivery on premium shipping orders</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#8A7973]">
                <FiRotateCcw className="text-[#8C6239] w-4 h-4 flex-shrink-0" />
                <span>30-day hassle-free returns on standard items</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#8A7973]">
                <FiShield className="text-[#8C6239] w-4 h-4 flex-shrink-0" />
                <span>10-year structural frame warranty coverage</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Specifications & Descriptions Segment */}
        <div className="mt-12 md:mt-16 bg-white border border-[#EFE8DF] rounded-[32px] overflow-hidden shadow-sm">
          <div className="flex border-b border-[#EFE8DF] bg-[#FAF7F2]/40">
            <button
              onClick={() => setActiveTab("description")}
              className={`flex-1 md:flex-none px-6 py-4 text-xs font-bold tracking-widest uppercase cursor-pointer border-b-2 transition-all ${
                activeTab === "description"
                  ? "border-[#8C6239] text-[#8C6239] bg-white"
                  : "border-transparent text-[#8A7973] hover:text-[#281C19]"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              className={`flex-1 md:flex-none px-6 py-4 text-xs font-bold tracking-widest uppercase cursor-pointer border-b-2 transition-all ${
                activeTab === "specifications"
                  ? "border-[#8C6239] text-[#8C6239] bg-white"
                  : "border-transparent text-[#8A7973] hover:text-[#281C19]"
              }`}
            >
              Specifications
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === "description" ? (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#281C19] uppercase tracking-wide">Product Details</h3>
                <p className="text-xs md:text-sm text-[#8A7973] leading-relaxed font-normal">
                  {product.description}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex justify-between py-2.5 border-b border-[#EFE8DF]/60 text-xs">
                  <span className="font-bold text-[#8A7973] uppercase tracking-wide">Material</span>
                  <span className="text-[#281C19] font-semibold">{selectedMaterial}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[#EFE8DF]/60 text-xs">
                  <span className="font-bold text-[#8A7973] uppercase tracking-wide">Colorway</span>
                  <span className="text-[#281C19] font-semibold">{selectedColor}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[#EFE8DF]/60 text-xs">
                  <span className="font-bold text-[#8A7973] uppercase tracking-wide">Width (cm)</span>
                  <span className="text-[#281C19] font-semibold">{product.dimensions?.width || "-"}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[#EFE8DF]/60 text-xs">
                  <span className="font-bold text-[#8A7973] uppercase tracking-wide">Height (cm)</span>
                  <span className="text-[#281C19] font-semibold">{product.dimensions?.height || "-"}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[#EFE8DF]/60 text-xs">
                  <span className="font-bold text-[#8A7973] uppercase tracking-wide">Depth (cm)</span>
                  <span className="text-[#281C19] font-semibold">{product.dimensions?.depth || "-"}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[#EFE8DF]/60 text-xs">
                  <span className="font-bold text-[#8A7973] uppercase tracking-wide">Weight (kg)</span>
                  <span className="text-[#281C19] font-semibold">{product.weight || "-"}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[#EFE8DF]/60 text-xs col-span-1 md:col-span-2">
                  <span className="font-bold text-[#8A7973] uppercase tracking-wide">Availability</span>
                  <span className={`font-semibold ${product.stock ? "text-[#8C6239]" : "text-red-600"}`}>
                    {product.stock ? "In Stock (Ships in 3-5 days)" : "Made to Order (Ships in 4-6 weeks)"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
