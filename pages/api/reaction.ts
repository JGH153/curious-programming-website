import { NextApiRequest, NextApiResponse } from "next";
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
      response.status(400).json({
        error: "Need both postId and emoji",
      });
      return;
    }
    const emojiName = emojiToName(request.body.emoji);
    if (emojiName === null) {
      response.status(400).json({
        error: "Unknown emoji",
      });
      return;
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
