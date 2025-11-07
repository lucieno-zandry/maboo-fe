import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import type React from "react";

export type CartButtonProps = {
  count: number,
} & React.ClassAttributes<HTMLButtonElement> & React.ButtonHTMLAttributes<HTMLButtonElement>

export default ({ count, ...buttonProps }: CartButtonProps) => {
  const isBadgeVisible = count > 0;

  const displayCount = count > 99 ? '99+' : count;

  return (
    // The container is relative to position the absolute badge correctly
    <div className="relative inline-block">
      <Button variant={"ghost"}
        aria-label={`Shopping Cart with ${count} items`}
        {...buttonProps}>
        <ShoppingCart className="w-6 h-6" />
      </Button>

      {/* The Count Badge - only renders if isBadgeVisible is true */}
      {isBadgeVisible && (
        // Absolute positioning relative to the parent div
        <div
          className="
            absolute 
            -top-2 
            -right-2 
            h-6 w-6 
            rounded-full 
            bg-red-500 
            text-white 
            text-xs 
            font-bold 
            flex 
            items-center 
            justify-center 
            border-2 
            border-white 
            shadow-md
            animate-bounce-once
            transition-opacity duration-300
          "
        >
          {displayCount}
        </div>
      )}

      {/* Define a simple animation for the badge appearance */}
      <style>{`
        @keyframes bounce-once {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .animate-bounce-once {
          animation: bounce-once 0.3s ease-out 1;
        }
      `}</style>
    </div>
  );
};