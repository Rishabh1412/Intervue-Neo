import { cn, getTechLogos } from "@/utils";
import Image from "next/image";
import React from "react";

interface TechIconProps {
  techstack: string[];
}

const DisplayTextIcons = async ({ techstack }: TechIconProps) => {
  const techIcons = await getTechLogos(techstack);

  return (
    <div className="flex flex-row gap-2">
      {techIcons.slice(0, 3).map(({ tech, url },index) => (
        <div
          key={tech}
          className={cn("relative group border-l-1 border-dark-100 bg-dark-300 rounded-full p-2 flex items-center shadow-2xs justify-center",index>=1 ? "-ml-5" :"")}
        >
          <span className="tech-tooltip absolute bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
            {tech}
          </span>
          <Image
            src={url}
            alt={tech}
            width={20}
            height={20}
            className="size-5  object-contain"
            priority
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTextIcons;
