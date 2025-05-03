import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input border-[1.5px] bg-background hover:border hover:border-bgColor/100 hover:text-accent-foreground",
        secondary:
          "bg-buttonColor  text-bgColor hover:bg-buttonColor/80 rounded-2xl text-sm font-poppins font-semibold ",
          primary:
          "bg-buttonColor  text-bgColor hover:bg-buttonColor/80 rounded-2xl text-sm font-poppins font-semibold ",
        service:
          "bg-slate-900 text-secondary-foreground hover:bg-primary hover:text-primary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        logo: "h-5 px-3 py-5",
         hero: "pt-[19px] pb-[16px] pl-[50px] pr-[50px]",
        default: "h-10 px-4 py-2",
        base: "h-11 lg:px-4 lg:py-4 md:px-3 md:py-3 px-2 py-2",
        sm: "h-11 rounded-md px-2",
        lg: "h-11 rounded-md px-8",
        xl: "h-11 rounded-full px-[66px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
