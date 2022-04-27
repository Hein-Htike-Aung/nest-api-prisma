-- CreateTable
CREATE TABLE "_AuthorsPublishers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorsPublishers_AB_unique" ON "_AuthorsPublishers"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorsPublishers_B_index" ON "_AuthorsPublishers"("B");
