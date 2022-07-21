import { NextApiRequest, NextApiResponse } from "next";
import { sanityClientBackend } from "../../shared/sanityClientBackend";
import { httpClient } from "../../shared/httpClient";
import { config } from "../../shared/config";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "GET") {
    response.status(200).json({
      comments: [],
    });
  } else if (request.method === "POST") {
    // TODO make and save to sanity with approved = false
    // TODO add captcha?

    // TODO cleaner list of validators
    if (request.body.comment.length > 1000) {
      response.status(400).json({
        error: "Comment is too long, max 1000 characters",
      });
      return;
    }

    if (!request.body.recaptchaToken) {
      response.status(400).json({
        error: "No recaptcha token provided",
      });
      return;
    }

    const recaptchaResponse = await httpClient.postString(
      "https://www.google.com/recaptcha/api/siteverify ",
      `secret=${process.env.RECAPTCHA_SECRET}&response=${request.body.recaptchaToken}`
    );

    if (!recaptchaResponse.ok || !recaptchaResponse.body.success) {
      response.status(400).json({
        error: "Recaptcha failed",
      });
      return;
    }

    // consider hold for review if less that 0.7
    if (recaptchaResponse.body.score < 0.5) {
      response.status(400).json({
        error: config.apiErrors.tooLowRecaptchaScore,
      });
      return;
    }

    // TODO is this secure?
    const doc = {
      _type: "comment",
      postId: request.body.postId,
      author: request.body.author,
      approved: false,
      body: request.body.comment,
    };

    const newDoc = await sanityClientBackend.create(doc);

    // force rebuild with new comment
    // TODO does not seem to work?
    await response.revalidate("/post/" + request.body.postId);

    response.status(200).json({
      ...newDoc,
    });
  } else {
    response.status(400).json({
      status: "Not OK",
    });
  }
}
