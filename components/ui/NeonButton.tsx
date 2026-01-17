import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

interface NeonButtonProps extends HTMLMotionProps<"button"> {
  children?: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "outline" | "ghost";
}

export function NeonButton({ children, className, loading, variant = "primary", ...props }: NeonButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 font-bold text-white transition-all duration-300 rounded-lg group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";

  const variants = {
    primary: "bg-primary/80 hover:bg-primary hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] border border-transparent",
    outline: "bg-transparent border border-primary/50 hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]",
    ghost: "bg-transparent hover:bg-white/5 border border-transparent"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
      {variant === 'primary' && (
         <div className="absolute inset-0 -z-10 rounded-lg blur-md bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.button>
  );
}
