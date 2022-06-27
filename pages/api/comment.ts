import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../shared/sanityClient";
import { sanityClientBackend } from "../../shared/sanityClientBackend";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "GET") {
    response.status(200).json({
      comments: [],
    });
  } else if (request.method === "POST") {
    // TODO make and save to sanity with approved = false
    // TODO add captcha?

    if (request.body.comment.length > 1000) {
      response.status(400).json({
        error: "Comment is too long, max 1000 characters",
      });
      return;
    }

    const doc = {
      _type: "comment",
      postId: request.body.postId,
      author: request.body.author,
      approved: false,
      body: request.body.comment,
    };

    const createdComment = await sanityClientBackend.create(doc);

    // force rebuild with new comment
    await response.unstable_revalidate("/post/" + request.body.postId);

    response.status(200).json({
      status: "ok",
    });
  } else {
    response.status(400).json({
      status: "Not OK",
    });
  }
}
