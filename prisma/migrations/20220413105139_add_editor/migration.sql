-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "hashRt" TEXT,
    "name" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "bookMarkCount" INTEGER NOT NULL DEFAULT 0,
    "editorId" INTEGER,
    CONSTRAINT "users_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("bookMarkCount", "createdAt", "email", "hashRt", "id", "isApproved", "name", "password", "updatedAt") SELECT "bookMarkCount", "createdAt", "email", "hashRt", "id", "isApproved", "name", "password", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_editorId_key" ON "users"("editorId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
