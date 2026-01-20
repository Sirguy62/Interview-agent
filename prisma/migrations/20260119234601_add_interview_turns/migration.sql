-- CreateTable
CREATE TABLE "InterviewTurn" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "speaker" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewTurn_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InterviewTurn" ADD CONSTRAINT "InterviewTurn_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
