import { NextApiResponse } from "next";

export const badRequestError = (response: NextApiResponse, error: string) => {
  response.status(400).json({
    error,
  });
};