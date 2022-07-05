/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { Video } from "../shared/Video.interface";

interface Props {
  video: Video;
}

export function YoutubeCard(props: Props) {
  return (
    <a
      href={"https://www.youtube.com/watch?v=" + props.video.id}
      target="_blank"
      rel="noreferrer"
    >
      <div className="flex justify-center">
        <div className="flex flex-col md:flex-row rounded-xl bg-white shadow-lg">
          {/* TODO fix on both mobile and desktop */}
          {/* <Image
            src={props.video.thumbnail}
            alt={props.video.title}
            width={props.video.thumbnailWidth}
            height={props.video.thumbnailHeight}
            className="w-full rounded-t-lg md:rounded-none md:rounded-l-lg"
            layout="responsive"
          ></Image> */}
          <img
            className="w-full md:h-auto  rounded-t-lg md:rounded-none md:rounded-l-lg"
            src={props.video.thumbnail}
            alt=""
          />
          <div className="p-6 flex flex-col justify-start">
            <h5 className="text-gray-900 text-xl font-medium mb-2">{props.video.title}</h5>
            <p className="text-gray-700 text-base mb-4">{props.video.description}</p>
          </div>
        </div>
      </div>
    </a>
  );
}
