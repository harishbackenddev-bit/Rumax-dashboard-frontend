import type { ImgHTMLAttributes } from "react";
import { asset } from "@/data/site";

type AssetImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  name: string;
};

export function AssetImage({ name, alt = "", ...props }: AssetImageProps) {
  return <img src={asset(name)} alt={alt} {...props} />;
}
