"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  fetchProducts,
  deleteProduct,
  toggleProductStatus,
  toggleProductField,
  fetchCategories,
  fetchRooms
} from "@/utils/api";
import { ProductIcon, CategoryIcon, RoomIcon } from "@/components/admin/Icons";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dropdownRef = useRef(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page to 1 when filters or search term changes
  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [searchTerm, categoryFilter, roomFilter, statusFilter]);

  // Load all data
  const loadData = async () => {
    try {
      const [prodRes, catRes, roomRes] = await Promise.all([
        fetchProducts({ limit: 100 }), // Fetch more products for client-side pagination
        fetchCategories(),
        fetchRooms()
      ]);

      if (prodRes.success) {
        setProducts(prodRes.data);
      } else {
        toast.error(prodRes.message || "Failed to fetch products");
      }

      if (catRes.success) {
        setCategories(catRes.data);
      }

      if (roomRes.success) {
        setRooms(roomRes.data);
      }
    } catch (err) {
      toast.error("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      loadData();
    }, 0);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle boolean field toggle (stock, featured, bestSeller, newArrival)
  const handleToggleField = async (id, flag, currentValue) => {
    const response = await toggleProductField(id, flag);
    if (response.success) {
      toast.success(`${flag.charAt(0).toUpperCase() + flag.slice(1)} updated successfully`);
      setProducts((prev) =>
        prev.map((prod) =>
          prod._id === id ? { ...prod, [flag]: !currentValue } : prod
        )
      );
    } else {
      toast.error(response.message || "Failed to update field");
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id, currentStatus) => {
    setActiveDropdown(null);
    const response = await toggleProductStatus(id);
    if (response.success) {
      toast.success("Status updated successfully");
      setProducts((prev) =>
        prev.map((prod) =>
          prod._id === id ? { ...prod, status: !currentStatus } : prod
        )
      );
    } else {
      toast.error(response.message || "Failed to update status");
    }
  };

  // Handle deletion
  const handleDelete = async (id, name) => {
    setActiveDropdown(null);
    const isDark = document.documentElement.classList.contains("dark");
    const result = await Swal.fire({
      title: "Delete Product?",
      text: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3c50e0",
      cancelButtonColor: "#f23c3c",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: isDark ? "#1c2434" : "#ffffff",
      color: isDark ? "#dee4ee" : "#1e293b",
    });

    if (result.isConfirmed) {
      const response = await deleteProduct(id);
      if (response.success) {
        toast.success("Product deleted successfully");
        loadData();
      } else {
        toast.error(response.message || "Failed to delete product");
      }
    }
  };

  // Filter logic
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      (prod.categoryId && (prod.categoryId._id === categoryFilter || prod.categoryId.slug === categoryFilter));

    const matchesRoom =
      roomFilter === "all" ||
      (prod.roomId && (prod.roomId._id === roomFilter || prod.roomId.slug === roomFilter));

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? prod.status === true
        : prod.status === false;

    return matchesSearch && matchesCategory && matchesRoom && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
            Product List
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-400">
            Manage your furniture products inventory
          </p>
        </div>
        <Link
          href="/admin/product/add"
          className="inline-flex items-center justify-center rounded-sm bg-black px-6 py-3 text-center font-medium text-white hover:bg-opacity-90 dark:bg-white dark:text-black dark:hover:bg-opacity-90 transition-all duration-150 shadow-sm"
        >
          <span className="mr-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </span>
          Create Product
        </Link>
      </div>

      {/* Filter and Search Panel */}
      <div className="rounded-sm border border-[#e2e8f0] bg-white p-4 shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-sm border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-12 pr-4 text-black outline-none focus:border-[#3c50e0] dark:border-[#2e3a47] dark:bg-[#24303f] dark:text-white dark:focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none rounded-sm border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-5 pr-10 text-black outline-none focus:border-[#3c50e0] dark:border-[#2e3a47] dark:bg-[#24303f] dark:text-white dark:focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>

            {/* Room Type Filter */}
            <div className="relative">
              <select
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="appearance-none rounded-sm border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-5 pr-10 text-black outline-none focus:border-[#3c50e0] dark:border-[#2e3a47] dark:bg-[#24303f] dark:text-white dark:focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="all">All Room Types</option>
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none rounded-sm border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-5 pr-10 text-black outline-none focus:border-[#3c50e0] dark:border-[#2e3a47] dark:bg-[#24303f] dark:text-white dark:focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-sm border border-[#e2e8f0] bg-white shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300 overflow-x-auto no-scrollbar w-full">
        <div className="max-w-full min-h-[200px]">
          <table className="w-full min-w-[900px] table-auto border-collapse">
            <thead>
              <tr className="bg-[#f7f9fc] text-left dark:bg-[#24303f] transition-colors duration-300">
                <th className="px-3.5 py-4 text-xs font-semibold uppercase text-slate-400 w-12 text-center">ID</th>
                <th className="px-3.5 py-4 text-xs font-semibold uppercase text-slate-400">Product</th>
                <th className="px-3.5 py-4 text-xs font-semibold uppercase text-slate-400">Category</th>
                <th className="px-3.5 py-4 text-xs font-semibold uppercase text-slate-400">Room Type</th>
                <th className="px-3.5 py-4 text-xs font-semibold uppercase text-slate-400">Pricing</th>
                <th className="px-3.5 py-4 text-xs font-semibold uppercase text-slate-400 text-center">Attributes</th>
                <th className="px-3.5 py-4 text-xs font-semibold uppercase text-slate-400 text-center w-24">Status</th>
                <th className="px-3.5 py-4 text-right text-xs font-semibold uppercase text-slate-400 w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#3c50e0] border-t-transparent dark:border-blue-500"></div>
                      <span className="text-sm font-medium text-slate-400">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                      <span className="text-base font-semibold text-slate-500 dark:text-slate-400">
                        No Products Found
                      </span>
                      <p className="text-xs text-slate-400 max-w-xs">
                        Try adjusting your filters or create a new product to get started.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod, index) => {
                  const formattedIndex = String(startIndex + index + 1).padStart(2, "0");
                  return (
                    <tr
                      key={prod._id}
                      className="border-b border-[#eee] hover:bg-slate-50/50 dark:border-[#2e3a47] dark:hover:bg-[#24303f]/30 transition-all duration-150 cursor-pointer"
                      onClick={(e) => {
                        if (
                          e.target.closest("button") ||
                          e.target.closest("a") ||
                          e.target.closest(".absolute") ||
                          e.target.closest("input")
                        ) {
                          return;
                        }
                        setSelectedProduct(prod);
                      }}
                    >
                      {/* Index */}
                      <td className="px-3.5 py-4 text-center text-sm font-medium text-slate-400">
                        {formattedIndex}
                      </td>

                      {/* Product Thumbnail & Name */}
                      <td className="px-3.5 py-4 max-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#f7f9fc] dark:bg-[#24303f] border border-[#e2e8f0] dark:border-slate-700 overflow-hidden shrink-0">
                            {prod.thumbnail ? (
                              <img
                                src={prod.thumbnail}
                                alt={prod.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ProductIcon className="w-5 h-5 text-[#3c50e0] dark:text-blue-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="block font-semibold text-black dark:text-white truncate" title={prod.name}>
                              {prod.name}
                            </span>
                            <span className="block text-xs text-slate-400 font-medium truncate" title={prod.slug}>
                              Slug: {prod.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-3.5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <CategoryIcon className="w-4 h-4 text-slate-400 shrink-0" />
                          {prod.categoryId?.name || "Unknown"}
                        </span>
                      </td>

                      {/* Room Type */}
                      <td className="px-3.5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <RoomIcon className="w-4 h-4 text-slate-400 shrink-0" />
                          {prod.roomId?.name || "Unknown"}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="px-3.5 py-4">
                        <div>
                          <span className="block font-bold text-black dark:text-white whitespace-nowrap">
                            ₹{prod.salePrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 whitespace-nowrap">
                            <span className="line-through">₹{prod.originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span className="text-emerald-500">(-{prod.discount}%)</span>
                          </div>
                        </div>
                      </td>

                      {/* Attribute Badges / Toggles */}
                      <td className="px-3.5 py-4">
                        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[220px] mx-auto">
                          {/* Stock Toggle */}
                          <button
                            onClick={() => handleToggleField(prod._id, "stock", prod.stock)}
                            className={`px-2 py-0.5 text-[9px] font-bold rounded-full cursor-pointer transition-colors border whitespace-nowrap ${
                              prod.stock
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20"
                            }`}
                            title="Toggle Stock Availability"
                          >
                            Stock: {prod.stock ? "In Stock" : "Out of Stock"}
                          </button>

                          {/* Featured Toggle */}
                          <button
                            onClick={() => handleToggleField(prod._id, "featured", prod.featured)}
                            className={`px-2 py-0.5 text-[9px] font-bold rounded-full cursor-pointer transition-colors border whitespace-nowrap ${
                              prod.featured
                                ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                                : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20"
                            }`}
                            title="Toggle Featured"
                          >
                            Featured
                          </button>

                          {/* BestSeller Toggle */}
                          <button
                            onClick={() => handleToggleField(prod._id, "bestSeller", prod.bestSeller)}
                            className={`px-2 py-0.5 text-[9px] font-bold rounded-full cursor-pointer transition-colors border whitespace-nowrap ${
                              prod.bestSeller
                                ? "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
                                : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20"
                            }`}
                            title="Toggle Best Seller"
                          >
                            Best Seller
                          </button>

                          {/* New Arrival Toggle */}
                          <button
                            onClick={() => handleToggleField(prod._id, "newArrival", prod.newArrival)}
                            className={`px-2 py-0.5 text-[9px] font-bold rounded-full cursor-pointer transition-colors border whitespace-nowrap ${
                              prod.newArrival
                                ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                                : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20"
                            }`}
                            title="Toggle New Arrival"
                          >
                            New Arrival
                          </button>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-3.5 py-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(prod._id, prod.status)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                            prod.status
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                          }`}
                          title="Click to toggle status"
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              prod.status ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {prod.status ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Action Dropdown */}
                      <td className="px-3.5 py-4 text-right relative">
                        <div className="inline-block text-left" ref={activeDropdown === prod._id ? dropdownRef : null}>
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === prod._id ? null : prod._id)}
                            className="inline-flex items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-slate-50 dark:border-[#2e3a47] dark:bg-[#24303f] dark:text-white dark:hover:bg-[#1c2434] transition-all cursor-pointer shadow-sm"
                          >
                            Actions
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>

                          {activeDropdown === prod._id && (
                            <div className="absolute right-0 mt-2 z-50 w-44 rounded-sm border border-[#e2e8f0] bg-white shadow-lg dark:border-[#2e3a47] dark:bg-[#1c2434] transition-all duration-200">
                              <div className="py-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedProduct(prod);
                                    setActiveDropdown(null);
                                  }}
                                  className="flex w-full items-center px-4 py-2 text-sm text-left font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#24303f] transition-colors cursor-pointer"
                                >
                                  View
                                </button>
                                <hr className="border-[#e2e8f0] dark:border-[#2e3a47] my-1" />
                                <Link
                                  href={`/admin/product/add?id=${prod._id}`}
                                  className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#24303f] transition-colors"
                                >
                                  Edit
                                </Link>
                                <hr className="border-[#e2e8f0] dark:border-[#2e3a47] my-1" />
                                <button
                                  onClick={() => handleToggleStatus(prod._id, prod.status)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#24303f] transition-colors"
                                >
                                  Toggle Status
                                </button>
                                <hr className="border-[#e2e8f0] dark:border-[#2e3a47] my-1" />
                                <button
                                  onClick={() => handleDelete(prod._id, prod.name)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-[#24303f] font-semibold transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Panel */}
        {totalItems > 0 && (
          <div className="flex flex-col gap-4 border-t border-[#e2e8f0] px-6 py-5.5 sm:flex-row sm:items-center sm:justify-between dark:border-[#2e3a47] bg-[#fcfdfe] dark:bg-[#18202d] rounded-b-sm transition-colors duration-300">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Showing <span className="font-bold text-black dark:text-white">{totalItems > 0 ? startIndex + 1 : 0}</span> to{" "}
                <span className="font-bold text-black dark:text-white">{endIndex}</span> of{" "}
                <span className="font-bold text-black dark:text-white">{totalItems}</span> products
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Prev Button */}
              <button
                type="button"
                disabled={activePage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="flex items-center justify-center h-8.5 px-3 rounded-sm border border-[#e2e8f0] hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-[#2e3a47] dark:hover:bg-[#24303f] dark:disabled:hover:bg-transparent text-sm font-semibold text-black dark:text-white transition-all cursor-pointer"
              >
                Previous
              </button>
              
              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`flex items-center justify-center w-8.5 h-8.5 rounded-sm text-sm font-bold transition-all cursor-pointer ${
                    activePage === p
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                      : "border border-[#e2e8f0] hover:bg-slate-50 dark:border-[#2e3a47] dark:hover:bg-[#24303f] text-black dark:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}

              {/* Next Button */}
              <button
                type="button"
                disabled={activePage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="flex items-center justify-center h-8.5 px-3 rounded-sm border border-[#e2e8f0] hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-[#2e3a47] dark:hover:bg-[#24303f] dark:disabled:hover:bg-transparent text-sm font-semibold text-black dark:text-white transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

function ProductDetailsModal({ product, onClose }) {
  const [activeImage, setActiveImage] = useState(product.thumbnail);

  // Combine thumbnail and additional images for the gallery
  const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);

  // Dimensions formatted string
  const dimensionsStr = product.dimensions
    ? `${product.dimensions.width || 0}W × ${product.dimensions.height || 0}H × ${product.dimensions.depth || 0}D cm`
    : "Not specified";

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm border border-[#e2e8f0] bg-white shadow-xl dark:border-[#2e3a47] dark:bg-[#1c2434] text-black dark:text-white transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4 dark:border-[#2e3a47]">
          <h2 className="text-xl font-bold">Product Information</h2>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/product/add?id=${product._id}`}
              className="inline-flex items-center justify-center rounded-sm bg-black px-4 py-2 text-center text-sm font-semibold text-white hover:bg-opacity-90 dark:bg-white dark:text-black dark:hover:bg-opacity-90 transition-all shadow-sm"
            >
              Edit Details
            </Link>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer text-2xl font-bold leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Images and Badges */}
          <div className="space-y-4">
            {/* Main Preview Image */}
            <div className="relative aspect-video w-full rounded border border-[#e2e8f0] dark:border-[#2e3a47] overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ProductIcon className="w-12 h-12 text-[#3c50e0] dark:text-blue-400" />
              )}
            </div>

            {/* Image Thumbnails Carousel */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`h-16 w-16 shrink-0 rounded border overflow-hidden transition-all bg-slate-50 dark:bg-slate-800 cursor-pointer ${
                      activeImage === img
                        ? "border-[#3c50e0] ring-2 ring-[#3c50e0]/20"
                        : "border-[#e2e8f0] dark:border-[#2e3a47] hover:border-slate-400"
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Badges / Status tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                product.stock
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                  : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20"
              }`}>
                {product.stock ? "In Stock" : "Out of Stock"}
              </span>

              <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                product.status
                  ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                  : "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
              }`}>
                {product.status ? "Status: Active" : "Status: Inactive"}
              </span>

              {product.featured && (
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                  Featured
                </span>
              )}

              {product.bestSeller && (
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20">
                  Best Seller
                </span>
              )}

              {product.newArrival && (
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-sky-50 text-sky-600 border border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20">
                  New Arrival
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Text Information */}
          <div className="space-y-5">
            <div>
              <h3 className="text-2xl font-bold text-black dark:text-white leading-tight">
                {product.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Slug: <code className="bg-slate-100 dark:bg-[#24303f] px-1.5 py-0.5 rounded text-xs">{product.slug}</code>
              </p>
            </div>

            {/* Category and Room Type */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-[#e2e8f0] py-3 dark:border-[#2e3a47]">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Category</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {product.categoryId?.name || "Unknown"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Room Type</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {product.roomId?.name || "Unknown"}
                </span>
              </div>
            </div>

            {/* Price Detail */}
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Pricing</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-black dark:text-white">
                  ₹{product.salePrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-base font-semibold text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                  {product.discount}% OFF
                </span>
              </div>
            </div>

            {/* Specs / Attributes */}
            <div className="grid grid-cols-2 gap-4 bg-[#f8fafc] dark:bg-[#24303f] p-4 rounded-sm border border-[#e2e8f0] dark:border-[#2e3a47]">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Material</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {product.material || "Not specified"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Color</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {product.color || "Not specified"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Dimensions</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono text-xs">
                  {dimensionsStr}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Weight</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {product.weight ? `${product.weight} kg` : "Not specified"}
                </span>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-2">
              {product.shortDescription && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Short Summary</span>
                  <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                    &ldquo;{product.shortDescription}&rdquo;
                  </p>
                </div>
              )}

              {product.description && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Description</span>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-h-[120px] overflow-y-auto pr-1">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* SEO Section */}
            {(product.seoTitle || product.seoDescription) && (
              <div className="border-t border-[#e2e8f0] pt-3 dark:border-[#2e3a47]">
                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">SEO Preview</span>
                <div className="text-xs bg-slate-50 dark:bg-[#18202d] p-3 rounded-sm space-y-1 border border-[#e2e8f0] dark:border-[#2e3a47]">
                  {product.seoTitle && <p className="font-bold text-[#1a0dab] dark:text-[#8ab4f8]">{product.seoTitle}</p>}
                  {product.seoDescription && <p className="text-slate-500 dark:text-slate-400">{product.seoDescription}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4 dark:border-[#2e3a47]">
          <button
            onClick={onClose}
            className="rounded-sm border border-[#e2e8f0] px-6 py-2.5 text-center text-sm font-semibold text-black hover:bg-slate-50 dark:border-[#2e3a47] dark:text-white dark:hover:bg-[#24303f] transition-all cursor-pointer"
          >
            Close
          </button>
          <Link
            href={`/admin/product/add?id=${product._id}`}
            className="rounded-sm bg-black px-6 py-2.5 text-center text-sm font-semibold text-white hover:bg-opacity-90 dark:bg-white dark:text-black dark:hover:bg-opacity-90 transition-all shadow-sm"
          >
            Edit Product
          </Link>
        </div>
      </div>
    </div>
  );
}
