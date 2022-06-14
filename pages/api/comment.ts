import { NextApiRequest, NextApiResponse } from "next";

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  console.log(request.method);
  if (request.method === "GET") {
    response.status(200).json({
      comments: [],
    });
  } else if (request.method === "POST") {
    // TODO make and save to sanity with approved = false
    // TODO add captcha?
    response.status(200).json({
      status: "ok",
    });
  } else {
    response.status(400).json({
      status: "Not OK man",
    });
  }
}
