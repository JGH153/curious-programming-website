interface Props {
  id: string;
}

export function YoutubeVideo(props: Props) {
  //         width="800"
  //height="500"
  return (
    <div className="flex items-center justify-center mt-4">
      <iframe
        className=" w-full aspect-video"
        src={"https://www.youtube.com/embed/" + props.id}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
