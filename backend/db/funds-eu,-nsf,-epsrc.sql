CREATE TABLE "public.Keywords" (
	"id" serial NOT NULL,
	"keyword" varchar NOT NULL UNIQUE,
	CONSTRAINT "Keywords_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.Grants_EU" (
	"id" serial NOT NULL,
	"unique_identifier" integer NOT NULL UNIQUE,
	"title" varchar NOT NULL,
	"abstract" varchar NOT NULL,
	"description" TEXT NOT NULL,
	"start_date" DATE NOT NULL,
	"end_date" DATE NOT NULL,
	"total_funding" FLOAT NOT NULL,
	"status" integer NOT NULL,
	"link" varchar NOT NULL,
	"keywords" TEXT NOT NULL,
	"approval_status" integer NOT NULL,
	"approval_timestamp" DATETIME NOT NULL,
	"created_at" integer NOT NULL,
	"updated_at" integer NOT NULL,
	"deleted" BOOLEAN NOT NULL,
	"deleted_at" integer NOT NULL,
	CONSTRAINT "Grants_EU_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.Grants_NSF" (
	"id" serial NOT NULL,
	"unique_identifier" integer NOT NULL UNIQUE,
	"title" varchar NOT NULL,
	"abstract" varchar NOT NULL,
	"start_date" DATE NOT NULL,
	"end_date" DATE NOT NULL,
	"awarded_amount_to_date" FLOAT NOT NULL,
	"keywords" TEXT NOT NULL,
	"created_at" integer NOT NULL,
	CONSTRAINT "Grants_NSF_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.Grants_EPSRC" (
	"id" serial NOT NULL,
	"unique_identifier" TEXT NOT NULL UNIQUE,
	"title" varchar NOT NULL,
	"abstract" varchar NOT NULL,
	"grant_category" TEXT NOT NULL,
	"lead_funder" TEXT NOT NULL,
	"start_date" DATE NOT NULL,
	"end_date" DATE NOT NULL,
	"project_cost" FLOAT NOT NULL,
	"grant_offer" FLOAT NOT NULL,
	"status" integer NOT NULL,
	"link" varchar NOT NULL,
	"keywords" TEXT NOT NULL,
	"created_at" integer NOT NULL,
	CONSTRAINT "Grants_EPSRC_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);











