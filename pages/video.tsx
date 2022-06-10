import { NextPage } from "next";
import { useEffect } from "react";
import { YoutubeCard } from "../components/YoutubeCard";
import { Video } from "../shared/Video.interface";

interface Props {
  videos: Video[];
}

const Video: NextPage<Props> = (props) => {
  return (
    <>
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

export async function getStaticProps() {
  const getVideos = async () => {
    const channelId = "UCVHumdPKnAbTFceoP-rD33g";
    const apiKey = process.env.YOUTUBE_API_KEY;
    const response = await fetch(
      `https://content-youtube.googleapis.com/youtube/v3/search?channelId=${channelId}&key=${apiKey}&maxResults=50&order=date&part=snippet`
    );
    const data = await response.json();
    const videos = data.items
      .filter((current: any) => current.id.kind === "youtube#video")
      .map((current: any) => ({
        id: current.id.videoId,
        title: current.snippet.title,
        description: current.snippet.description,
        thumbnail: current.snippet.thumbnails.medium.url,
      }));

    // https://img.youtube.com/vi/kkAmJsXuBLw/0.jpg
    return videos;
  };

  const videos = await getVideos();

  return {
    props: {
      videos: videos,
    },
  };
}

export default Video;
