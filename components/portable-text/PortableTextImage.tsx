import urlBuilder from "@sanity/image-url";
import { getImageDimensions } from "@sanity/asset-utils";
import { sanityClient } from "../../shared/sanityClient";

// Barebones lazy-loaded image component
export const PortableTextImage = ({ value, isInline }: any) => {
  const { width, height } = getImageDimensions(value);
  return (
    // TODO use Image component instead of <img>
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={urlBuilder(sanityClient)
        .image(value)
        .width(isInline ? 100 : 800)
        .fit("max")
        .auto("format")
        .url()}
      alt={value.alt || " "}
      loading="lazy"
      className="m-auto"
      style={{
        // Display alongside text if image appears inside a block text span
        display: isInline ? "inline-block" : "block",

        // Avoid jumping around with aspect-ratio CSS property
        aspectRatio: (width / height).toString(),
      }}
    />
  );
};
