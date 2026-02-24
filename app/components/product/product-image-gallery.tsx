"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

type Props = {
  product: Product;
  selectedVariant?: Variant | null;
  canSeeSpecial?: boolean;
  placeholderImage: string;
  t: (key: string) => string;
};

export function ProductImageGallery({
  product,
  selectedVariant,
  canSeeSpecial,
  placeholderImage,
  t,
}: Props) {
  const images = useMemo(() => {
    if (selectedVariant?.image?.url) {
      return [selectedVariant.image];
    }

    if (product.images?.length) {
      return product.images.slice(0, 4);
    }

    return [{ url: placeholderImage }];
  }, [product.images, selectedVariant, placeholderImage]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selected image when variant changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [selectedVariant?.id]);

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* MAIN IMAGE */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted border border-gray-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage?.url}
            src={selectedImage?.url}
            alt={product.title}
            className="h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {canSeeSpecial && selectedVariant?.special_price && (
          <Badge className="absolute top-6 left-6 bg-green-600 text-white border-none px-4 py-1.5 text-sm font-bold shadow-lg">
            {t("partnerPricing")}
          </Badge>
        )}
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.url}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border transition-all duration-200",
                selectedIndex === index
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-gray-200 hover:border-gray-400"
              )}
            >
              <img
                src={image.url}
                alt={`${product.title} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}