import sanityClientLib from "@sanity/client";

// ONLY use in API folder
// TODO move to API folder?
export const sanityClientBackend = sanityClientLib({
  projectId: "p3gew69c",
  dataset: "production",
  token: process.env.SANITY_BACKEND_TOKEN || "",
  apiVersion: "2021-03-25", // use current UTC date - see "specifying API version"!
  useCdn: false, // `false` if you want to ensure fresh data
});
