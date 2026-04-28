// routes/frontoffice/product-detail/components/product-images-gallery.tsx

import { useState, useRef } from "react";
import { ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface AppImage {
    id: string | number;
    url: string;
    alt?: string;
}

// ── Zoomable Image Component ───────────────────────────────────────────────────
function ZoomableImage({ src, alt }: { src: string; alt?: string }) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const imgRef = useRef<HTMLImageElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imgRef.current) return;

        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setPosition({ x, y });
    };

    return (
        <div
            className="group relative flex-1 overflow-hidden rounded-lg border bg-muted cursor-crosshair"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
        >
            <img
                ref={imgRef}
                src={src}
                alt={alt || "Product image"}
                className="aspect-square w-full object-contain sm:aspect-[4/3] md:max-h-[520px] transition-transform duration-200 ease-out"
                style={{
                    transformOrigin: `${position.x}% ${position.y}%`,
                    transform: isZoomed ? "scale(2)" : "scale(1)",
                }}
            />
        </div>
    );
}

// ── Dumb (View) ──────────────────────────────────────────────────────────────
interface ProductImagesGalleryViewProps {
    images: AppImage[];
    selectedIndex: number;
    onSelect: (index: number) => void;
    // Translated strings
    noImagesLabel: string;
    selectImageLabel: string;
    thumbnailAltPattern: string;
    productImageAlt: string;
}

export function ProductImagesGalleryView({
    images,
    selectedIndex,
    onSelect,
    noImagesLabel,
    selectImageLabel,
    thumbnailAltPattern,
    productImageAlt,
}: ProductImagesGalleryViewProps) {
    if (!images || images.length === 0) {
        return (
            <div className="flex aspect-square w-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 sm:aspect-[4/3] md:max-h-[520px]">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-10 w-10 opacity-50" />
                    <p className="text-sm font-medium">{noImagesLabel}</p>
                </div>
            </div>
        );
    }

    const mainImage = images[selectedIndex];

    return (
        <div className="flex flex-col-reverse gap-3 sm:gap-4 md:flex-row">
            {/* Thumbnails (vertical on desktop) */}
            <div className="flex gap-2 overflow-x-auto pb-1 md:max-h-[520px] md:flex-col md:overflow-y-auto md:overflow-x-hidden md:pb-0 custom-scrollbar">
                {images.map((img, i) => {
                    const isSelected = i === selectedIndex;
                    return (
                        <button
                            key={img.id}
                            onClick={() => onSelect(i)}
                            aria-current={isSelected ? "true" : undefined}
                            aria-label={selectImageLabel.replace("{{index}}", String(i + 1))}
                            className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200 sm:h-16 sm:w-16 
                                ${isSelected ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/50 opacity-70 hover:opacity-100"}
                            `}
                        >
                            <img
                                src={img.url}
                                alt={thumbnailAltPattern.replace("{{index}}", String(i + 1))}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        </button>
                    );
                })}
            </div>

            {/* Main image with Zoom capabilities */}
            <ZoomableImage src={mainImage.url} alt={mainImage.alt || productImageAlt} />
        </div>
    );
}

// ── Smart (Container) ────────────────────────────────────────────────────────
interface ProductImagesGalleryProps {
    images: AppImage[];
}

export function ProductImagesGallery({ images = [] }: ProductImagesGalleryProps) {
    const { t } = useTranslation("product-detail");
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <ProductImagesGalleryView
            images={images}
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(Math.min(index, Math.max(0, images.length - 1)))}
            noImagesLabel={t("gallery.noImages")}
            selectImageLabel={t("gallery.selectImage")}
            thumbnailAltPattern={t("gallery.thumbnailAlt")}
            productImageAlt={t("gallery.productImageAlt")}
        />
    );
}