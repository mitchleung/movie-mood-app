import Image from "next/image";

const MoviePoster = ({
  posterUrl,
  title = "",
}: {
  posterUrl: string | null;
  title: string;
}) => {
  return (
    <>
      {posterUrl ? (
        <Image src={posterUrl} alt={title} fill className="object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
          No poster
        </div>
      )}
    </>
  );
};

export default MoviePoster;
