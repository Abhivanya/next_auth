export default function VideoPlayer({ url }: { url: string }) {
  return (
    <div className="w-1/6 aspect-video">
      <iframe
        className="w-full h-full"
        src={url}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
