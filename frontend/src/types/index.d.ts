declare module "@/lib/utils" {
  import { type ClassValue } from "clsx";
  export function cn(...inputs: ClassValue[]): string;
}

declare module "class-variance-authority" {
  export function cva(base: string, config: any): (...args: any[]) => string;
  export type VariantProps<T extends (...args: any) => any> = {
    [K in keyof Parameters<T>[0]]: string | boolean | number;
  };
}

declare module "@radix-ui/react-slot" {
  export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
  }
  export const Slot: React.FC<SlotProps>;
} 