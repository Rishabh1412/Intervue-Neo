import React from "react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { getRandomInterviewCover } from "@/utils";
import DisplayTextIcons from "./DisplayTextIcons";

interface Feedback {
  totalScore?: number;
  finalAssessment?: string;
  createdAt?: string | Date;
}

interface InterviewCardProps {
  id: string;
  userId: string;
  role: string;
  type: string;
  techstack?: string[];
  createdAt?: string | Date;
}

const InterviewCard = ({
  id,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback = null as Feedback | null; // Replace with actual feedback data when available
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview relative p-4">
        <div className="absolute top-0 right-0 w-fit px-4 py-2 bg-light-600 rounded-bl-lg">
          <p className="badge-text">{normalizedType}</p>
        </div>

        <Image
          src={getRandomInterviewCover()}
          alt="cover image"
          width={90}
          height={90}
          className="rounded-full object-fit size-[90px]"
        />

        <h3 className="mt-5 capitalize">{role} Interview</h3>

        <div className="flex flex-wrap gap-5 mt-3">
          <div className="flex flex-row gap-2 items-center">
            <Image src="/calendar.svg" alt="calendar" width={22} height={22} />
            <p>{formattedDate}</p>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" alt="star" width={22} height={22} />
            <p>{feedback?.totalScore || "---"}/100</p>
          </div>
        </div>

        <p className="line-clamp-2 mt-5">
          {feedback?.finalAssessment ||
            "Feedback will be available after you complete the interview."}
        </p>
        <div className="flex flex-row items-center justify-between">
          <DisplayTextIcons techstack={techstack || []} />
          <div className="btn-primary flex items-center">
            <Link
              href={
                feedback
                  ? `/interview/${id}/feedback`
                  : `/interview/${id}`
              }
            >
              {feedback ? "Check Feedback" : "View Interview"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
