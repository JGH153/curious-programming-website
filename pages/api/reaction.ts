import { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../shared/config";
import { httpClient } from "../../shared/httpClient";
import { sanityClientBackend } from "../../shared/sanityClientBackend";

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
    // TODO add captcha?

    if (
      request.body.emoji.length !== 2 ||
      request.body.postId.length < 36 ||
      request.body.change > 1 ||
      request.body.change < -1
    ) {
      return response.status(400).json({
        error: "Need both postId and emoji",
      });
    }

    const emojiName = emojiToName(request.body.emoji);
    if (emojiName === null) {
      return response.status(400).json({
        error: "Unknown emoji",
      });
    }

    if (!request.body.recaptchaToken) {
      return response.status(400).json({
        error: "No recaptcha token provided",
      });
    }

    const recaptchaResponse = await httpClient.postString(
      "https://www.google.com/recaptcha/api/siteverify ",
      `secret=${process.env.RECAPTCHA_SECRET}&response=${request.body.recaptchaToken}`
    );

    if (!recaptchaResponse.ok || !recaptchaResponse.body.success) {
      return response.status(400).json({
        error: "Recaptcha failed",
      });
    }

    if (recaptchaResponse.body.score < 0.5) {
      return response.status(400).json({
        error: config.apiErrors.tooLowRecaptchaScore,
      });
    }

    const result = await sanityClientBackend
      .patch(request.body.postId)
      .inc({ [emojiName]: request.body.change })
      .commit();

    // force rebuild with new comment
    await response.revalidate("/post/" + request.body.postId);

    response.status(200).json({
      ...result,
    });
  } else {
    response.status(400).json({
      status: "Not OK",
    });
  }
}
