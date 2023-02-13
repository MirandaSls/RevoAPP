-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birthday" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "accepte_route" TEXT,
    "recuse_route" TEXT,
    "just_for_show" BOOLEAN NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friend" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL,
    "time" TEXT NOT NULL,
    "place" TEXT NOT NULL DEFAULT 'Não informado',
    "authorId" TEXT NOT NULL,
    "cellphone" INTEGER NOT NULL DEFAULT 31000000,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'userId',
    "eventId" TEXT,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "money" DOUBLE PRECISION NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "eventId" TEXT,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceviedGoal" (
    "id" TEXT NOT NULL,
    "money" DOUBLE PRECISION NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "eventId" TEXT,
    "userId" TEXT,

    CONSTRAINT "ReceviedGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalMaterial" (
    "id" TEXT NOT NULL,
    "material_name" TEXT NOT NULL,
    "goalId" TEXT,

    CONSTRAINT "GoalMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceviedMaterial" (
    "id" TEXT NOT NULL,
    "material_name" TEXT NOT NULL,
    "recevied" BOOLEAN NOT NULL,
    "receviedGoalId" TEXT,

    CONSTRAINT "ReceviedMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceviedGoal" ADD CONSTRAINT "ReceviedGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceviedGoal" ADD CONSTRAINT "ReceviedGoal_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalMaterial" ADD CONSTRAINT "GoalMaterial_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceviedMaterial" ADD CONSTRAINT "ReceviedMaterial_receviedGoalId_fkey" FOREIGN KEY ("receviedGoalId") REFERENCES "ReceviedGoal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
