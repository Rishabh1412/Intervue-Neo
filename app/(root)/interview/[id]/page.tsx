import React from 'react'
import {getInterviewsById} from "@/lib/actions/general.action";
import {redirect} from "next/navigation";
import Image from "next/image";
import {getRandomInterviewCover} from "@/utils";
import DisplayTextIcons from "@/components/DisplayTextIcons";
import Agent from "@/components/Agent";
import {getCurrentUser} from "@/lib/actions/auth.action";

const page = async ({params}:RouteParams) => {
  const {id} = await params;
  const user = await getCurrentUser();
  const username = await user?.name || "User";
  const interview = await getInterviewsById(id);

  if(!interview) redirect('/');

  return (
    <>
      <div className={"flex flex-row gap-4 justify-between"}>
        <div className={"flex flex-row gap-4 items-center max-sm:flex-col"}>
          <div className={"flex flex-row gap-4 items-center"}>
            <Image src={getRandomInterviewCover()} alt={"cover-image"} height={40} width={40} priority className={"rounded-full object-cover size-[40px"}/>
            <h3 className={"capitalize"}>{interview.role}</h3>
          </div>
          <DisplayTextIcons techstack={interview.techstack}/>
        </div>
        <p className={"bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize"}>{interview.type}</p>
      </div>
      <Agent userName={username} userId={user?.id} interviewId={id} type={"interview"} questions={interview.questions}/>
    </>
  )
}

export default page