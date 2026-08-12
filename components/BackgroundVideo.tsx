import { BG_VIDEO_SRC } from "@/lib/content";

export default function BackgroundVideo() {
  return (
    <div className="bg">
      <video className="bg-video" autoPlay muted loop playsInline>
        <source src={BG_VIDEO_SRC} type="video/mp4" />
      </video>
    </div>
  );
}
