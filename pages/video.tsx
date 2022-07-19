import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import probe from "probe-image-size";
import { useEffect } from "react";
import { YoutubeCard } from "../components/YoutubeCard";
import { config } from "../shared/config";
import { Video } from "../shared/Video.interface";

interface Props {
  videos: Video[];
}

const Video: NextPage<Props> = (props) => {
  return (
    <>
      <Head>
        <title>{`Youtube Videos - ${config.metaTags.title}`}</title>
        <meta
          name="description"
          content={"List of videos for Curious Programming"}
        />
      </Head>
      <div className="flex flex-col space-y-4">
        {props.videos.map((video) => (
          <YoutubeCard
            key={video.id}
            video={video}
          />
        ))}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const getVideos = async () => {
    const channelId = "UCVHumdPKnAbTFceoP-rD33g";
    const apiKey = process.env.YOUTUBE_API_KEY;
    const response = await fetch(
      `https://content-youtube.googleapis.com/youtube/v3/search?channelId=${channelId}&key=${apiKey}&maxResults=50&order=date&part=snippet`
    );
    const data = await response.json();
    const videos: Video[] = await Promise.all(
      data.items
        .filter((current: any) => current.id.kind === "youtube#video")
        .map(async (current: any) => {
          let result = await probe(current.snippet.thumbnails.medium.url);
          return {
            id: current.id.videoId,
            title: current.snippet.title,
            description: current.snippet.description,
            thumbnail: current.snippet.thumbnails.medium.url,
            thumbnailWidth: result.width,
            thumbnailHeight: result.height,
          };
        })
    );

    // https://img.youtube.com/vi/kkAmJsXuBLw/0.jpg
    return videos;
  };

  const videos = await getVideos();

  return {
    props: {
      videos: videos,
      revalidate: config.defaultRevalidateTime,
    },
  };
};

export default Video;
