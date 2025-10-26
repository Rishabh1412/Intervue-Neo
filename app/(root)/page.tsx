import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import React from "react";
import InterviewCard from '../../components/InterviewCard';

const page = () => {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice and Feedback</h2>
          <p className="text-lg">
            Practice on real interview questions and get instant feedback.
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <a href="/interview">Start the Interview</a>
          </Button>
        </div>
        <Image
          src="/robot.png"
          alt="robo-dude"
          className="max-sm:hidden"
          width={400}
          height={400}
        />
      </section>

      <section className="flex flex-col mt-8 gap-6">
        <h2>Your interviews</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}     
        </div>
      </section>

      <section className="flex flex-col mt-8 gap-6">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
          {/*<p>There are no interviews available</p>*/}
        </div>
      </section>
    </>
  );
};

export default page;
