-- CreateTable
CREATE TABLE "bio_parts" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "vector" vector,
    "vector_len" INTEGER,

    CONSTRAINT "bio_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "who" TEXT,
    "player_name" TEXT,
    "text" TEXT,
    "vector" vector,
    "vector_len" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "supabase_id" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "twitter_id" VARCHAR(255) NOT NULL,
    "twitter_full_name" VARCHAR(255),
    "twitter_user_name" VARCHAR(255),
    "twitter_avatar_url" VARCHAR(255),

    CONSTRAINT "players_pkey" PRIMARY KEY ("supabase_id")
);

-- CreateTable
CREATE TABLE "secrets" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "vector" vector,
    "vector_len" INTEGER,

    CONSTRAINT "secrets_pkey" PRIMARY KEY ("id")
);

