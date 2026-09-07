import bhutanMapImage from "@/assets/webisteimage.png";

const InteractiveBhutanMap = () => {
  return (
    <div className="relative overflow-hidden rounded-[1.55rem] bg-background">
      <div
        className="relative aspect-[3/2]"
        aria-label="3D map of Bhutan"
      >
        <img
          src={bhutanMapImage}
          alt="Illustrated 3D map of Bhutan showing major destinations and landmarks"
          className="h-full w-full select-none object-contain"
          draggable={false}
          loading="lazy"
        />
      </div>
      <p className="bg-background px-4 py-2 text-[10px] text-muted-foreground">Map illustration via GeoGnos</p>
    </div>
  );
};

export default InteractiveBhutanMap;