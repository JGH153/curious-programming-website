import { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../shared/config";
import { getPostSlug } from "../../shared/api/getPostSlug";
import { httpClient } from "../../shared/httpClient";
import { sanityClientBackend } from "../../shared/sanityClientBackend";
import { badRequestError } from "../../shared/api/badRequestError";

const emojiToName = (emoji: string) => {
  const emojiMap = new Map();
  emojiMap.set("🔥", "fireReactions");
  emojiMap.set("😲", "surprisedReactions");
  emojiMap.set("😒", "mehReactions");
  if (emojiMap.has(emoji)) {
    return emojiMap.get(emoji);
  }
  return null;
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "POST") {
    if (
      request.body.emoji.length !== 2 ||
      request.body.postId.length < 36 ||
      request.body.change > 1 ||
      request.body.change < -1
    ) {
      return badRequestError(response, "Need both postId and emoji");
    }

    const emojiName = emojiToName(request.body.emoji);
    if (emojiName === null) {
      return badRequestError(response, "Unknown emoji");
    }

    if (!request.body.recaptchaToken) {
      return badRequestError(response, "No recaptcha token provided");
    }

    const recaptchaResponse = await httpClient.postString(
      "https://www.google.com/recaptcha/api/siteverify ",
      `secret=${process.env.RECAPTCHA_SECRET}&response=${request.body.recaptchaToken}`
    );

    if (!recaptchaResponse.ok || !recaptchaResponse.body.success) {
      return badRequestError(response, "Recaptcha failed");
    }

    if (recaptchaResponse.body.score < 0.5) {
      return badRequestError(response, config.apiErrors.tooLowRecaptchaScore);
    }

    const result = await sanityClientBackend
      .patch(request.body.postId)
      .inc({ [emojiName]: request.body.change })
      .commit();

    // get post slug
    const postSlug = await getPostSlug(request.body.postId);
    if (!postSlug) {
      return badRequestError(response, "Post not found");
    }

    // force rebuild with new comment
    await response.revalidate("/post/" + postSlug.slug.current);

    response.status(200).json({
      ...result,
    });
  } else {
    response.status(400).json({
      status: "Not OK",
    });
  }
}
