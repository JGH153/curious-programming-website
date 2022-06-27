import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../shared/sanityClient";
import { sanityClientBackend } from "../../shared/sanityClientBackend";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  console.log(request.method);
  if (request.method === "GET") {
    response.status(200).json({
      comments: [],
    });
  } else if (request.method === "POST") {
    // TODO make and save to sanity with approved = false
    // TODO add captcha?

    const doc = {
      _type: "comment",
      postId: request.body.postId,
      author: request.body.author,
      approved: false,
      body: request.body.comment,
    };

    const createdComment = await sanityClientBackend.create(doc);
    console.log(`Comment was created, document ID is ${createdComment._id}`);

    response.status(200).json({
      status: "ok",
    });
  } else {
    response.status(400).json({
      status: "Not OK man",
    });
  }
}
