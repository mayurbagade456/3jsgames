import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "rounded-2xl bg-primary text-primary-foreground shadow-clay-sm hover:brightness-[1.04] hover:-translate-y-0.5",
        secondary:
          "rounded-2xl bg-secondary text-secondary-foreground shadow-clay-sm hover:brightness-[1.03] hover:-translate-y-0.5",
        soft:
          "rounded-2xl bg-muted text-foreground shadow-clay-sm hover:brightness-[1.02] hover:-translate-y-0.5",
        destructive:
          "rounded-2xl bg-destructive text-destructive-foreground shadow-clay-sm hover:brightness-[1.04]",
        outline:
          "rounded-2xl border-2 border-border bg-card/50 hover:bg-muted",
        ghost: "rounded-2xl hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 text-sm",
        sm: "h-9 px-4 text-sm rounded-xl",
        lg: "h-14 px-9 text-base",
        icon: "h-11 w-11 rounded-2xl",
        "icon-sm": "h-9 w-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
