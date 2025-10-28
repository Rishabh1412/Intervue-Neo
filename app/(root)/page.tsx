import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import InterviewCard from "../../components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation"; // 1. Import redirect

const page = async () => {
  const user = await getCurrentUser();

  // 2. --- THIS IS THE FIX ---
  // If there is no user, redirect to sign-in *before* fetching data.
  if (!user || !user.id) {
    redirect("/sign-in");
  }
  // --- END FIX ---

  // 3. Now that you know the user exists, you can safely fetch data.
  // Notice the "!" is removed because it's no longer needed.
  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
  ]);

  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;

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
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>You have no past interviews. Start one now!</p>
          )}
        </div>
      </section>

      <section className="flex flex-col mt-8 gap-6">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
          {/*<p>There are no interviews available</p>*/}
        </div>
      </section>
    </>
  );
};

export default page;