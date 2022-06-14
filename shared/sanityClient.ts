import sanityClientLib from "@sanity/client";

export const sanityClient = sanityClientLib({
  projectId: "p3gew69c",
  dataset: "production",
  apiVersion: "2021-03-25", // use current UTC date - see "specifying API version"!
  token: "", // or leave blank for unauthenticated usage
  useCdn: false, // `false` if you want to ensure fresh data
});
