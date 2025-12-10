import React from 'react';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-offset-slate-950',
  {
    variants: {
      variant: {
        default: 'bg-brand-500 text-white hover:bg-brand-600',
        outline:
          'border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-900',
        ghost: 'bg-transparent text-slate-200 hover:bg-slate-900',
        subtle: 'bg-slate-900 text-slate-100 hover:bg-slate-800'
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-9 px-4',
        lg: 'h-10 px-5'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';
    return (
      <Comp
        ref={ref}
        className={twMerge(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
