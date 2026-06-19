"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Hero from "@/components/common/Hero";
import { fetchCategories, fetchProducts, fetchRooms } from "@/utils/api";

// Reusable SVG product illustration matching the BestSellers page layout
const ProductIllustration = ({ name = "", category = "" }) => {
  const cName = category.toLowerCase();
  const pName = name.toLowerCase();

  if (cName.includes("sofa") || pName.includes("sofa") || pName.includes("loveseat")) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-xl">
        <svg className="w-24 h-16 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 120 80">
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
      <div className="w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-xl">
        <svg className="w-12 h-16 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 80 100">
          <rect x="15" y="10" width="50" height="80" rx="4" fill="none" stroke="#8C6239" strokeWidth="4" />
          <line x1="15" y1="32" x2="65" y2="32" stroke="#8C6239" strokeWidth="4" />
          <line x1="15" y1="54" x2="65" y2="54" stroke="#8C6239" strokeWidth="4" />
          <line x1="15" y1="76" x2="65" y2="76" stroke="#8C6239" strokeWidth="4" />
          <circle cx="30" cy="70" r="4" fill="#D2C4B9" />
        </svg>
      </div>
    );
  }

  if (cName.includes("table") || pName.includes("table") || pName.includes("desk") || pName.includes("coffee")) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-xl">
        <svg className="w-20 h-16 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 100 80">
          <ellipse cx="50" cy="35" rx="35" ry="12" />
          <rect x="42" y="42" width="6" height="22" rx="1" />
          <rect x="52" y="42" width="6" height="22" rx="1" />
          <ellipse cx="50" cy="64" rx="16" ry="5" />
        </svg>
      </div>
    );
  }

  if (cName.includes("chair") || pName.includes("chair") || pName.includes("armchair")) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-xl">
        <svg className="w-16 h-16 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 100 80">
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
    <div className="w-full h-full flex items-center justify-center bg-[#F3ECE4]/40 rounded-xl">
      <svg className="w-20 h-16 text-[#8C6239]/80" fill="currentColor" viewBox="0 0 100 80">
        <rect x="20" y="20" width="60" height="40" rx="6" />
        <rect x="28" y="25" width="44" height="15" rx="2" fill="#C4A484" />
        <line x1="24" y1="60" x2="24" y2="68" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
        <line x1="76" y1="60" x2="76" y2="68" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
};

function StoreContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filters State
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active filter bindings
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  
  const [minPrice, setMinPrice] = useState("8000");
  const [maxPrice, setMaxPrice] = useState("250000");
  const [sortBy, setSortBy] = useState("default");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Static items fallback
  const MOCK_PRODUCTS = [
    {
      _id: "p-1",
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
      slug: "ember-velvet-3-seater"
    },
    {
      _id: "p-2",
      name: "Natura Dining Table",
      categoryId: { name: "DINING", slug: "dining" },
      roomId: { name: "Dining Room", slug: "dining-room" },
      salePrice: 124000,
      originalPrice: 155000,
      discount: 20,
      badge: "",
      rating: 5,
      reviewsCount: 62,
      material: "Solid Wood",
      color: "Medium Brown",
      stock: true,
      slug: "natura-dining-table"
    },
    {
      _id: "p-3",
      name: "Terra Coffee Table",
      categoryId: { name: "TABLES", slug: "tables" },
      roomId: { name: "Living Room", slug: "living-room" },
      salePrice: 38000,
      discount: 0,
      badge: "NEW",
      rating: 4,
      reviewsCount: 29,
      material: "Marble",
      color: "Off-white/Cream",
      stock: true,
      slug: "terra-coffee-table"
    },
    {
      _id: "p-4",
      name: "Aura Bouclé Armchair",
      categoryId: { name: "ACCENT CHAIRS", slug: "chairs" },
      roomId: { name: "Living Room", slug: "living-room" },
      salePrice: 54000,
      discount: 0,
      badge: "BESTSELLER",
      rating: 5,
      reviewsCount: 94,
      material: "Linen",
      color: "Slate Blue",
      stock: true,
      slug: "aura-boucle-armchair"
    },
    {
      _id: "p-5",
      name: "Walnut Media Console",
      categoryId: { name: "MEDIA & TV UNITS", slug: "media" },
      roomId: { name: "Living Room", slug: "living-room" },
      salePrice: 67000,
      originalPrice: 86000,
      discount: 22,
      badge: "",
      rating: 4,
      reviewsCount: 37,
      material: "Solid Wood",
      color: "Dark Brown/Charcoal",
      stock: true,
      slug: "walnut-media-console"
    },
    {
      _id: "p-6",
      name: "Linen Wardrobe Cabinet",
      categoryId: { name: "BEDROOM", slug: "bedroom" },
      roomId: { name: "Bedroom", slug: "bedroom" },
      salePrice: 118000,
      discount: 0,
      badge: "NEW",
      rating: 5,
      reviewsCount: 19,
      material: "Linen",
      color: "Sand",
      stock: false,
      slug: "linen-wardrobe-cabinet"
    },
    {
      _id: "p-7",
      name: "Mid-Century Modern Loveseat",
      categoryId: { name: "SOFAS", slug: "sofas" },
      roomId: { name: "Living Room", slug: "living-room" },
      salePrice: 50316,
      originalPrice: 63000,
      discount: 20,
      badge: "",
      rating: 5,
      reviewsCount: 15,
      material: "Velvet",
      color: "Sand",
      stock: true,
      slug: "mid-century-modern-loveseat"
    },
    {
      _id: "p-8",
      name: "Platform King Bed with Headboard",
      categoryId: { name: "BEDS", slug: "beds" },
      roomId: { name: "Bedroom", slug: "bedroom" },
      salePrice: 79112,
      originalPrice: 96000,
      discount: 20,
      badge: "",
      rating: 5,
      reviewsCount: 39,
      material: "Solid Wood",
      color: "Sand",
      stock: true,
      slug: "platform-king-bed-with-headboard"
    },
    {
      _id: "p-9",
      name: "Tufted Velvet Storage Queen Bed",
      categoryId: { name: "BEDS", slug: "beds" },
      roomId: { name: "Bedroom", slug: "bedroom" },
      salePrice: 79128,
      originalPrice: 97200,
      discount: 20,
      badge: "",
      rating: 5,
      reviewsCount: 27,
      material: "Velvet",
      color: "Slate Blue",
      stock: true,
      slug: "tufted-velvet-storage-queen-bed"
    },
    {
      _id: "p-10",
      name: "Minimalist Oak Desk",
      categoryId: { name: "TABLES", slug: "tables" },
      roomId: { name: "Home Office", slug: "home-office" },
      salePrice: 24500,
      discount: 0,
      badge: "",
      rating: 4,
      reviewsCount: 12,
      material: "Solid Wood",
      color: "Sand",
      stock: true,
      slug: "minimalist-oak-desk"
    },
    {
      _id: "p-11",
      name: "Leather Office Chair",
      categoryId: { name: "ACCENT CHAIRS", slug: "chairs" },
      roomId: { name: "Home Office", slug: "home-office" },
      salePrice: 18900,
      discount: 0,
      badge: "NEW",
      rating: 5,
      reviewsCount: 22,
      material: "Leather",
      color: "Dark Slate/Black",
      stock: true,
      slug: "leather-office-chair"
    },
    {
      _id: "p-12",
      name: "Ceramic Table Lamp",
      categoryId: { name: "DECOR", slug: "decor" },
      roomId: { name: "Bedroom", slug: "bedroom" },
      salePrice: 8500,
      discount: 0,
      badge: "",
      rating: 4,
      reviewsCount: 31,
      material: "Marble",
      color: "Off-white/Cream",
      stock: true,
      slug: "ceramic-table-lamp"
    },
    {
      _id: "p-13",
      name: "Velvet Accent Pouf",
      categoryId: { name: "ACCENT CHAIRS", slug: "chairs" },
      roomId: { name: "Living Room", slug: "living-room" },
      salePrice: 12000,
      discount: 0,
      badge: "",
      rating: 5,
      reviewsCount: 18,
      material: "Velvet",
      color: "Sand",
      stock: true,
      slug: "velvet-accent-pouf"
    },
    {
      _id: "p-14",
      name: "Teak Outdoor Lounge Chair",
      categoryId: { name: "CHAIRS", slug: "chairs" },
      roomId: { name: "Living Room", slug: "living-room" },
      salePrice: 34000,
      discount: 0,
      badge: "",
      rating: 4,
      reviewsCount: 8,
      material: "Solid Wood",
      color: "Medium Brown",
      stock: false,
      slug: "teak-outdoor-lounge-chair"
    },
    {
      _id: "p-15",
      name: "Glass Display Cabinet",
      categoryId: { name: "STORAGE", slug: "storage" },
      roomId: { name: "Dining Room", slug: "dining-room" },
      salePrice: 58000,
      discount: 0,
      badge: "NEW",
      rating: 5,
      reviewsCount: 14,
      material: "Solid Wood",
      color: "Dark Slate/Black",
      stock: true,
      slug: "glass-display-cabinet"
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
  const roomFallback = ["Living Room", "Bedroom", "Dining Room", "Home Office"];

  // Read URL Category on load
  useEffect(() => {
    const catQuery = searchParams.get("category");
    if (catQuery && catQuery !== "all") {
      // Find matching category name
      const matched = categories.find(c => c.slug === catQuery);
      if (matched) {
        setSelectedRooms([matched.name]);
      } else {
        // Fallback to formatted title
        const formatted = catQuery.replace("-", " ");
        const firstLetterCap = formatted.charAt(0).toUpperCase() + formatted.slice(1);
        setSelectedRooms([firstLetterCap]);
      }
    }
  }, [searchParams, categories]);

  // Load backend categories and products
  useEffect(() => {
    const loadStoreData = async () => {
      try {
        const catRes = await fetchCategories();
        const prodRes = await fetchProducts();
        const roomRes = await fetchRooms();

        if (catRes.success) {
          setCategories(catRes.data.filter((c) => c.status !== false));
        }
        
        if (roomRes.success && roomRes.data.length > 0) {
          setRooms(roomRes.data);
        }

        if (prodRes.success && prodRes.data.length > 0) {
          // Map backend attributes to filter schema
          const mapped = prodRes.data.map(p => ({
            ...p,
            reviewsCount: p.reviewsCount || Math.floor(Math.random() * 80) + 15,
            rating: p.rating || 5,
            material: p.material || (p.name.includes("Velvet") ? "Velvet" : "Solid Wood"),
            color: p.color || "Medium Brown",
          }));
          setProducts(mapped);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      } catch (error) {
        console.error("Error loading store details:", error);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    loadStoreData();
  }, []);

  // Filter application
  useEffect(() => {
    let items = [...products];

    // Filter by Room Type
    if (selectedRooms.length > 0) {
      items = items.filter(p => 
        selectedRooms.some(r => 
          (p.roomId?.name && p.roomId.name.toLowerCase().includes(r.toLowerCase())) ||
          (p.categoryId?.name && p.categoryId.name.toLowerCase().includes(r.toLowerCase()))
        )
      );
    }

    // Filter by Material
    if (selectedMaterials.length > 0) {
      items = items.filter(p => p.material && selectedMaterials.includes(p.material));
    }

    // Filter by Color
    if (selectedColors.length > 0) {
      items = items.filter(p => p.color && selectedColors.includes(p.color));
    }

    // Filter by Availability
    if (selectedAvailability.length > 0) {
      items = items.filter(p => {
        const availabilityStr = p.stock ? "In Stock" : "Made to Order";
        return selectedAvailability.includes(availabilityStr);
      });
    }

    // Filter by Rating
    if (selectedRating !== null) {
      items = items.filter(p => (p.rating || 5) >= selectedRating);
    }

    // Filter by Price Range
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || 99999999;
    items = items.filter(p => p.salePrice >= min && p.salePrice <= max);

    // Sorting
    if (sortBy === "price-asc") {
      items.sort((a, b) => a.salePrice - b.salePrice);
    } else if (sortBy === "price-desc") {
      items.sort((a, b) => b.salePrice - a.salePrice);
    } else if (sortBy === "rating") {
      items.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    setFilteredProducts(items);
    setCurrentPage(1); // Reset page offset on filter change
  }, [products, selectedRooms, selectedMaterials, selectedColors, selectedAvailability, selectedRating, minPrice, maxPrice, sortBy]);

  // Handle checkboxes
  const handleCheckboxToggle = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  // Clear specific badges
  const handleRemoveFilter = (type, val) => {
    if (type === "room") setSelectedRooms(selectedRooms.filter(r => r !== val));
    if (type === "material") setSelectedMaterials(selectedMaterials.filter(m => m !== val));
    if (type === "color") setSelectedColors(selectedColors.filter(c => c !== val));
    if (type === "availability") setSelectedAvailability(selectedAvailability.filter(a => a !== val));
    if (type === "rating") setSelectedRating(null);
  };

  // Calculate product counts dynamically for Room Type sidebar labels
  const getProductCountForRoom = (roomName) => {
    return products.filter(p => 
      (p.roomId?.name && p.roomId.name.toLowerCase().includes(roomName.toLowerCase())) ||
      (p.categoryId?.name && p.categoryId.name.toLowerCase().includes(roomName.toLowerCase()))
    ).length;
  };

  // Pagination indexing
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  // Hero custom graphics
  const storeHeroIllustration = (
    <svg
      className="w-72 h-44 text-[#FAF7F2] opacity-85 transform hover:scale-[1.03] transition-transform duration-700 ease-out animate-float"
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="20" y="30" width="160" height="40" rx="8" fill="#FAF7F2" fillOpacity="0.08" stroke="#C4A484" strokeWidth="2" strokeOpacity="0.6" />
      <rect x="30" y="40" width="65" height="30" rx="6" fill="#FAF7F2" fillOpacity="0.12" stroke="#C4A484" strokeWidth="1.5" strokeOpacity="0.8" />
      <rect x="105" y="40" width="65" height="30" rx="6" fill="#FAF7F2" fillOpacity="0.12" stroke="#C4A484" strokeWidth="1.5" strokeOpacity="0.8" />
      <rect x="10" y="45" width="20" height="35" rx="6" fill="#FAF7F2" fillOpacity="0.1" stroke="#C4A484" strokeWidth="1.8" strokeOpacity="0.7" />
      <rect x="170" y="45" width="20" height="35" rx="6" fill="#FAF7F2" fillOpacity="0.1" stroke="#C4A484" strokeWidth="1.8" strokeOpacity="0.7" />
      <rect x="20" y="70" width="160" height="12" rx="2" fill="#8C6239" fillOpacity="0.8" />
      <line x1="35" y1="82" x2="35" y2="90" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
      <line x1="165" y1="82" x2="165" y2="90" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="100" cy="92" rx="75" ry="4" fill="#000000" fillOpacity="0.15" />
    </svg>
  );

  return (
    <>
      {/* Visual store hero banner */}
      <Hero
        tag="NEW COLLECTION — SS 2026"
        title={
          <>
            Modern Living <br />
            <span className="italic font-serif text-[#C4A484] font-normal">Collection</span>
          </>
        }
        description="Timeless furniture crafted for elegant spaces. Designed with intention, built to endure."
        buttons={
          <a
            href="#catalog-layout"
            className="bg-[#8C6239] text-[#FAF7F2] hover:bg-[#724E2B] transition-all duration-300 font-semibold px-6 py-3 rounded text-sm md:text-base flex items-center gap-2 group/btn hover:scale-[1.03] hover:shadow-lg hover:shadow-[#8C6239]/25 cursor-pointer"
          >
            Explore Collection
            <span className="transform group-hover/btn:translate-x-2 transition-transform duration-200">→</span>
          </a>
        }
        illustration={storeHeroIllustration}
      />

      {/* Main filterable store directory */}
      <section id="catalog-layout" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Sidebar Filter panel */}
          <aside className="bg-white border border-[#EFE8DF] rounded-[24px] p-6 space-y-6 shadow-sm sticky top-24 self-start">
            <span className="text-[10px] font-bold text-[#8A7973] uppercase tracking-wider block border-b border-[#EFE8DF]/60 pb-3">
              FILTERS
            </span>

            {/* Room Type checkboxes */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#281C19] uppercase tracking-wide">Room Type</h4>
              <div className="space-y-2">
                {roomFallback.map(room => {
                  const count = getProductCountForRoom(room);
                  return (
                    <label key={room} className="flex items-center justify-between text-xs text-[#8A7973] cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedRooms.includes(room)}
                          onChange={() => handleCheckboxToggle(room, selectedRooms, setSelectedRooms)}
                          className="w-3.5 h-3.5 accent-[#8C6239] rounded border-gray-300 cursor-pointer"
                        />
                        <span className="group-hover:text-[#8C6239] transition-colors">{room}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">{count || 20}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <hr className="border-[#EFE8DF]/60" />

            {/* Price Range input boxes */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#281C19] uppercase tracking-wide">Price Range</h4>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#8A7973]">₹</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-lg pl-6 pr-2 py-1.5 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239] transition-all"
                  />
                </div>
                <span className="text-[#8A7973] text-xs font-bold">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#8A7973]">₹</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full bg-[#FAF7F2]/40 border border-[#EFE8DF] rounded-lg pl-6 pr-2 py-1.5 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239] transition-all"
                  />
                </div>
              </div>
            </div>

            <hr className="border-[#EFE8DF]/60" />

            {/* Material selector */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#281C19] uppercase tracking-wide">Material</h4>
              <div className="space-y-2">
                {materialsList.map(mat => (
                  <label key={mat} className="flex items-center gap-2 text-xs text-[#8A7973] cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(mat)}
                      onChange={() => handleCheckboxToggle(mat, selectedMaterials, setSelectedMaterials)}
                      className="w-3.5 h-3.5 accent-[#8C6239] rounded border-gray-300 cursor-pointer"
                    />
                    <span className="group-hover:text-[#8C6239] transition-colors">{mat}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-[#EFE8DF]/60" />

            {/* Color swatches */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#281C19] uppercase tracking-wide">Color</h4>
              <div className="flex flex-wrap gap-2.5">
                {colorSwatches.map(color => {
                  const isSelected = selectedColors.includes(color.name);
                  return (
                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() => handleCheckboxToggle(color.name, selectedColors, setSelectedColors)}
                      className={`w-6 h-6 rounded-full border cursor-pointer relative flex items-center justify-center transition-all ${
                        color.borderClass
                      } ${isSelected ? "ring-2 ring-[#8C6239] ring-offset-2 scale-105" : "hover:scale-110"}`}
                      style={{ backgroundColor: color.value }}
                    >
                      {isSelected && (
                        <span className={`text-[10px] font-bold ${
                          color.name.includes("Off-white") ? "text-[#8C6239]" : "text-white"
                        }`}>✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-[#EFE8DF]/60" />

            {/* Availability */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#281C19] uppercase tracking-wide">Availability</h4>
              <div className="space-y-2">
                {["In Stock", "Made to Order"].map(avail => (
                  <label key={avail} className="flex items-center gap-2 text-xs text-[#8A7973] cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedAvailability.includes(avail)}
                      onChange={() => handleCheckboxToggle(avail, selectedAvailability, setSelectedAvailability)}
                      className="w-3.5 h-3.5 accent-[#8C6239] rounded border-gray-300 cursor-pointer"
                    />
                    <span className="group-hover:text-[#8C6239] transition-colors">{avail}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-[#EFE8DF]/60" />

            {/* Rating stars filter */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#281C19] uppercase tracking-wide">Rating</h4>
              <div className="space-y-2">
                {[5, 4].map(stars => (
                  <button
                    key={stars}
                    onClick={() => setSelectedRating(selectedRating === stars ? null : stars)}
                    className={`flex items-center gap-2 text-xs w-full text-left cursor-pointer hover:text-[#8C6239] transition-all ${
                      selectedRating === stars ? "text-[#8C6239] font-bold" : "text-[#8A7973]"
                    }`}
                  >
                    <span className="flex text-sm tracking-tighter">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx} className={idx < stars ? "text-[#8C6239]" : "text-gray-200"}>★</span>
                      ))}
                    </span>
                    <span>& up</span>
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Right Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header row details */}
            <div className="bg-white border border-[#EFE8DF] rounded-[20px] px-6 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm">
              <div className="text-xs md:text-sm text-[#8A7973]">
                <span className="font-extrabold text-[#281C19]">{filteredProducts.length}</span> products found
              </div>

              {/* Sorting Control */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[#EFE8DF] rounded-xl px-3 py-1.5 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239]"
                >
                  <option value="default">Sort: Featured</option>
                  <option value="price-asc">Sort: Price Low to High</option>
                  <option value="price-desc">Sort: Price High to Low</option>
                  <option value="rating">Sort: Top Rated</option>
                </select>
              </div>
            </div>

            {/* Active filter badges indicator bar */}
            {(selectedRooms.length > 0 || selectedMaterials.length > 0 || selectedColors.length > 0 || selectedAvailability.length > 0 || selectedRating !== null) && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold text-[#8A7973] uppercase tracking-wider mr-1">Active:</span>
                
                {/* Room badges */}
                {selectedRooms.map(r => (
                  <button
                    key={r}
                    onClick={() => handleRemoveFilter("room", r)}
                    className="bg-white border border-[#EFE8DF] hover:border-[#8C6239] rounded-full px-3 py-1 text-[11px] text-[#281C19] font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    {r} <span className="text-gray-400 hover:text-[#8C6239]">×</span>
                  </button>
                ))}

                {/* Material badges */}
                {selectedMaterials.map(m => (
                  <button
                    key={m}
                    onClick={() => handleRemoveFilter("material", m)}
                    className="bg-white border border-[#EFE8DF] hover:border-[#8C6239] rounded-full px-3 py-1 text-[11px] text-[#281C19] font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    {m} <span className="text-gray-400 hover:text-[#8C6239]">×</span>
                  </button>
                ))}

                {/* Color badges */}
                {selectedColors.map(c => (
                  <button
                    key={c}
                    onClick={() => handleRemoveFilter("color", c)}
                    className="bg-white border border-[#EFE8DF] hover:border-[#8C6239] rounded-full px-3 py-1 text-[11px] text-[#281C19] font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    {c} <span className="text-gray-400 hover:text-[#8C6239]">×</span>
                  </button>
                ))}

                {/* Availability badges */}
                {selectedAvailability.map(a => (
                  <button
                    key={a}
                    onClick={() => handleRemoveFilter("availability", a)}
                    className="bg-white border border-[#EFE8DF] hover:border-[#8C6239] rounded-full px-3 py-1 text-[11px] text-[#281C19] font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    {a} <span className="text-gray-400 hover:text-[#8C6239]">×</span>
                  </button>
                ))}

                {/* Rating badges */}
                {selectedRating !== null && (
                  <button
                    onClick={() => handleRemoveFilter("rating", null)}
                    className="bg-white border border-[#EFE8DF] hover:border-[#8C6239] rounded-full px-3 py-1 text-[11px] text-[#281C19] font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    {selectedRating}★ & up <span className="text-gray-400 hover:text-[#8C6239]">×</span>
                  </button>
                )}
              </div>
            )}

            {/* Products grid display */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-[#EFE8DF] rounded-[24px]">
                <div className="w-8 h-8 border-3 border-[#8C6239] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-semibold text-[#8A7973]">Loading products catalog...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#EFE8DF] rounded-[24px] p-8 shadow-sm">
                <h3 className="text-base font-bold text-[#281C19]">No products match these filters</h3>
                <p className="text-xs text-[#8A7973] mt-1.5">Try resetting some parameters in the sidebar panel.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map((product) => {
                  const ratingStars = product.rating || 5;
                  const reviewsCount = product.reviewsCount || 24;
                  
                  // Discount badge
                  const hasDiscount = product.discount > 0 || (product.originalPrice && product.originalPrice > product.salePrice);
                  const discountPct = product.discount || (product.originalPrice ? Math.round(((product.originalPrice - product.salePrice)/product.originalPrice)*100) : 0);
                  
                  let badgeText = product.badge || "";
                  if (discountPct > 0 && !badgeText) badgeText = `-${discountPct}%`;

                  return (
                    <Link
                      key={product._id}
                      href={`/store/${product.slug}`}
                      className="bg-white border border-[#EFE8DF] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#8C6239]/5 hover:border-[#8C6239]/40 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full"
                    >
                      {/* Visual container top */}
                      <div className="aspect-[4/3] w-full bg-[#FAF7F2] p-6 relative flex items-center justify-center overflow-hidden flex-shrink-0">
                        {badgeText && (
                          <span className={`absolute top-4 left-4 text-[9px] font-extrabold text-[#FAF7F2] px-2.5 py-1 rounded tracking-widest uppercase z-10 ${
                            badgeText.startsWith("-") ? "bg-[#8C6239]" : badgeText === "NEW" ? "bg-[#2C1C18]" : "bg-[#3E2A24]"
                          }`}>
                            {badgeText}
                          </span>
                        )}

                        {/* Image representation */}
                        {product.thumbnail && product.thumbnail.startsWith("http") ? (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="max-h-[85%] max-w-[85%] object-contain transform group-hover:scale-108 transition-transform duration-500 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full max-h-[85%] max-w-[85%] transform group-hover:scale-108 transition-transform duration-500 ease-out">
                            <ProductIllustration name={product.name} category={product.categoryId?.name || ""} />
                          </div>
                        )}

                        {/* Hover Overlay Button bar */}
                        <div className="absolute bottom-0 left-0 w-full bg-[#3E2A24] py-3 text-center text-[10px] font-bold text-white tracking-widest uppercase transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out shadow-inner">
                          VIEW PRODUCT
                        </div>
                      </div>

                      {/* Info details bottom */}
                      <div className="p-5 flex-1 flex flex-col justify-between gap-3 bg-white">
                        <div>
                          <span className="text-[9px] font-extrabold text-[#8A7973] tracking-widest uppercase">
                            {product.categoryId?.name || "Furniture"}
                          </span>
                          <h3 className="text-sm font-bold text-[#281C19] group-hover:text-[#8C6239] transition-colors mt-0.5 line-clamp-1">
                            {product.name}
                          </h3>
                        </div>

                        {/* Rating row */}
                        <div className="flex items-center gap-1.5 text-xs text-[#8A7973] font-medium">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, starIdx) => (
                              <span
                                key={starIdx}
                                className={`text-sm ${
                                  starIdx < ratingStars ? "text-[#8C6239]" : "text-gray-200"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span>({reviewsCount})</span>
                        </div>

                        {/* Price Row */}
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-extrabold text-[#281C19]">
                            ₹{product.salePrice?.toLocaleString("en-IN")}
                          </span>
                          {product.originalPrice && product.originalPrice > product.salePrice && (
                            <span className="text-xs text-[#8A7973] line-through">
                              ₹{product.originalPrice?.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Mid-page offer promo banner (placed when grid has elements) */}
            {!loading && filteredProducts.length > 0 && (
              <div className="bg-[#281C19] text-[#E5D5CD] rounded-[20px] p-6 md:py-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden relative">
                {/* Background lighting flare */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#8C6239]/5 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="space-y-1 text-center md:text-left">
                  <span className="text-[9px] font-bold text-[#C4A484] tracking-[0.25em] uppercase block">
                    Limited Time Offer
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-[#FAF7F2] tracking-tight">
                    Free White Glove Delivery on orders above ₹75,000
                  </h3>
                </div>
                <Link
                  href="/store"
                  className="bg-[#8C6239] text-[#FAF7F2] hover:bg-[#724E2B] transition-all duration-300 px-6 py-2.5 rounded-lg text-xs font-bold hover:scale-105 shadow-sm whitespace-nowrap cursor-pointer"
                >
                  Shop Now
                </Link>
              </div>
            )}

            {/* Pagination numbers control bar */}
            {!loading && filteredProducts.length > 0 && (
              <div className="flex flex-col items-center gap-6 pt-6">
                
                {/* Page number buttons */}
                <div className="flex items-center gap-1.5">
                  {/* Prev page */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="w-8 h-8 rounded-lg border border-[#EFE8DF] flex items-center justify-center hover:border-[#8C6239] transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed text-xs text-[#8A7973]"
                  >
                    &lt;
                  </button>

                  {/* Dynamic page buttons */}
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentPage === page
                            ? "bg-[#281C19] text-white"
                            : "bg-white border border-[#EFE8DF] text-[#8A7973] hover:border-[#8C6239] hover:text-[#8C6239]"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Next page */}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="w-8 h-8 rounded-lg border border-[#EFE8DF] flex items-center justify-center hover:border-[#8C6239] transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed text-xs text-[#8A7973]"
                  >
                    &gt;
                  </button>
                </div>

                {/* LOAD MORE PRODUCTS button */}
                <button
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  disabled={currentPage >= totalPages}
                  className="bg-white border border-[#8C6239]/40 text-[#8C6239] hover:bg-[#8C6239] hover:text-white transition-all duration-300 font-bold px-8 py-3 rounded-xl text-[10px] tracking-wider uppercase cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#8C6239]"
                >
                  LOAD MORE PRODUCTS
                </button>

              </div>
            )}

          </div>

        </div>
      </section>
    </>
  );
}

export default function StorePage() {
  return (
    <main className="bg-[#FAF7F2] pb-16 flex-grow">
      <Suspense fallback={
        <div className="flex items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-3 border-[#8C6239] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-[#8A7973]">Loading store components...</span>
        </div>
      }>
        <StoreContent />
      </Suspense>
    </main>
  );
}
