-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "friendId" TEXT NOT NULL DEFAULT 'unkown';

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "eventName" TEXT NOT NULL DEFAULT 'Evento';
