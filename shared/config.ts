export const config = {
  defaultRevalidateTime: 60 * 30, // 30 min
  logRocketProject: "curious-programming/blog",
  localStorageKeys: {
    myUserName: "myUserName",
  },
  reCaptchaKey: "6Le85AAhAAAAAMTq09A8aQ3S_q9NmDdQzMsbJ0o_",
  metaTags: {
    title: "Curious Programming Blog",
    mainDescription: `A collection of blog post, videos and more for mainly frontend developers, but also so much more. Everything from low level processor architecture to developer rights and more.`,
  },
  apiErrors: {
    tooLowRecaptchaScore: "Too low recaptcha score",
  },
  readSpeedWPM: 200,
} as const;
