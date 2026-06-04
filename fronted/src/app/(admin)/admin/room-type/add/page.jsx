"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { addRoomType, fetchRoomsById, updateRoomType } from "@/utils/api";
import { generateSlug } from "@/utils/helper";

function AddRoomTypeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load existing details if editing
  useEffect(() => {
    if (editId) {
      const loadDetails = async () => {
        setLoading(true);
        const response = await fetchRoomsById(editId);
        if (response.success && response.data) {
          setName(response.data.name);
          setSlug(response.data.slug);
          setIsSlugManual(true);
        } else {
          toast.error(response.message || "Failed to load room type details");
        }
        setLoading(false);
      };
      loadDetails();
    }
  }, [editId]);

  // Handle room name change and auto-generate slug
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (!isSlugManual) {
      setSlug(generateSlug(value));
    }
  };

  // Track if user types in slug field manually
  const handleSlugChange = (e) => {
    setSlug(e.target.value);
    setIsSlugManual(true);
  };

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedName || trimmedName.length < 3) {
      toast.error("Room Type Name must be at least 3 characters long");
      return;
    }

    if (!trimmedSlug || trimmedSlug.length < 3) {
      toast.error("Room Type Slug must be at least 3 characters long");
      return;
    }

    setSubmitting(true);

    let result;
    if (editId) {
      result = await updateRoomType(editId, { name: trimmedName, slug: trimmedSlug });
    } else {
      result = await addRoomType({ name: trimmedName, slug: trimmedSlug });
    }

    if (result.success) {
      toast.success(result.message || (editId ? "Room Type updated successfully!" : "Room Type created successfully!"));
      router.push("/admin/room-type");
    } else {
      toast.error(result.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#3c50e0] border-t-transparent dark:border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/room-type"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-slate-100 dark:bg-[#1c2434] dark:text-white dark:hover:bg-[#24303f] border border-[#e2e8f0] dark:border-[#2e3a47] transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
            {editId ? "Edit Room Type" : "Create Room Type"}
          </h1>
          <p className="text-sm font-medium text-slate-400">
            {editId ? "Modify room category details and parameters" : "Add a new hotel room category option"}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-sm border border-[#e2e8f0] bg-white shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300">
        <div className="border-b border-[#e2e8f0] px-6.5 py-4 dark:border-[#2e3a47]">
          <h3 className="font-semibold text-black dark:text-white">
            {editId ? "Edit Room Type Details" : "Room Type Details"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6.5 space-y-6">
          {/* Room Name Input */}
          <div>
            <label className="mb-2.5 block text-sm font-semibold text-black dark:text-white">
              Room Type Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Deluxe Room, Suite Room"
              value={name}
              onChange={handleNameChange}
              className="w-full rounded-sm border border-[#e2e8f0] bg-transparent px-5 py-3 text-black outline-none focus:border-[#3c50e0] dark:border-[#2e3a47] dark:text-white dark:focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Slug Input */}
          <div>
            <label className="mb-2.5 block text-sm font-semibold text-black dark:text-white">
              Slug <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., deluxe-room"
              value={slug}
              onChange={handleSlugChange}
              className="w-full rounded-sm border border-[#e2e8f0] bg-transparent py-3 px-5 text-black outline-none focus:border-[#3c50e0] dark:border-[#2e3a47] dark:text-white dark:focus:border-blue-500 transition-colors"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              The URL-friendly slug will auto-generate from the name, but can be customized manually.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#e2e8f0] dark:border-[#2e3a47]">
            <Link
              href="/admin/room-type"
              className="rounded-sm border border-[#e2e8f0] px-6 py-3 text-center font-medium text-black hover:bg-slate-50 dark:border-[#2e3a47] dark:text-white dark:hover:bg-[#24303f] transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex justify-center rounded-sm bg-black px-6 py-3 font-medium text-white hover:bg-opacity-95 dark:bg-white dark:text-black dark:hover:bg-opacity-95 disabled:bg-slate-400 dark:disabled:bg-slate-700 transition-all cursor-pointer"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white dark:border-black border-t-transparent"></span>
                  Saving...
                </span>
              ) : editId ? (
                "Update Room Type"
              ) : (
                "Create Room Type"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddRoomTypePage() {
  return (
    <Suspense fallback={
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#3c50e0] border-t-transparent dark:border-blue-500"></div>
      </div>
    }>
      <AddRoomTypeForm />
    </Suspense>
  );
}
