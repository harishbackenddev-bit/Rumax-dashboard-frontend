import type { ReactNode } from "react";
import { AssetImage } from "@/components/ui/AssetImage";

type SectionTitleProps = {
  title: ReactNode;
  mark: string;
  markClass: string;
  className?: string;
  children?: ReactNode;
};

export function SectionTitle({ title, mark, markClass, className = "", children }: SectionTitleProps) {
  return (
    <div className={`section-title section-title--mark-left ${className}`}>
      <h2>
        <AssetImage className={`section-mark ${markClass}`} name={mark} aria-hidden="true" />
        {title}
      </h2>
      {children}
    </div>
  );
}
