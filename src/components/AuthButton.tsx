
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AuthButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export function AuthButton({
  children,
  className,
  variant = "default",
  isLoading = false,
  loadingText,
  ...props
}: AuthButtonProps) {
  return (
    <Button
      className={cn(
        "auth-button w-full text-base font-medium h-11",
        isLoading && "opacity-80 cursor-not-allowed",
        className
      )}
      variant={variant}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || "Loading..."}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
