import { redirect } from "next/navigation";
import { logger } from "@/lib/utils/logger";

export default function HomePage() {
  logger.info("HomePage accessed - redirecting to /dashboard");
  redirect("/dashboard");
}

