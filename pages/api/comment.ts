import { NextApiRequest, NextApiResponse } from "next";
import { sanityClientBackend } from "../../shared/sanityClientBackend";
import { httpClient } from "../../shared/httpClient";
import { config } from "../../shared/config";
import { getPostSlug } from "../../shared/api/getPostSlug";

const badRequestError = (response: NextApiResponse, error: string) => {
  response.status(400).json({
    error,
  });
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "GET") {
    response.status(200).json({
      comments: [],
    });
  } else if (request.method === "POST") {
    if (request.body.comment.length > 1000) {
      return badRequestError(response, "Comment is too long, max 1000 characters");
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

    const recaptchaScore = recaptchaResponse.body.score;

    if (recaptchaScore < 0.5) {
      return badRequestError(response, config.apiErrors.tooLowRecaptchaScore);
    }

    // TODO is this secure?
    const doc = {
      _type: "comment",
      postId: {
        _type: "reference",
        _ref: request.body.postId,
      },
      author: request.body.author,
      approved: recaptchaScore >= 0.6,
      body: request.body.comment,
    };

    const newDoc = await sanityClientBackend.create(doc);

    // get post slug
    const postSlug = await getPostSlug(request.body.postId);
    if (!postSlug) {
      return badRequestError(response, "Post not found");
    }

    // force rebuild with new comment
    await response.revalidate("/post/" + postSlug.slug.current);

    response.status(200).json({
      ...newDoc,
    });
  } else {
    response.status(400).json({
      status: "Not OK",
    });
  }
}
