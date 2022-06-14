// assume JSON both ways
class HttpClient {
  constructor() {}

  get() {
    console.error("USE SWR");
  }
  async post(url: string, body: object) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const responseJson = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      body: responseJson,
    };
  }
}

export const httpClient = new HttpClient();
