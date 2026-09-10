import { apiClient } from "@/lib/api/api";
import { Heading, Text } from "@/lib/components/Typography";

export const dynamic = "force-dynamic";

export default async function Page() {
  const backendStatus = await apiClient.health
    .getHealthCheck()
    .then((x) => {
      const good = !!x.data?.status;
      if (!good) {
        x.text().then((text) =>
          console.error(
            "Health check failed",
            "good:",
            good,
            "response:",
            text,
          ),
        );
      }
      return good;
    })
    .catch((error: unknown) => {
      console.log("Cannot get backend status", error);
      return false;
    });

  return (
    <div className="flex flex-col gap-1 text-center p-5">
      <Heading>System Status</Heading>
      <Text className="text-green-500">Frontend Status: OK</Text>
      <Text className={backendStatus ? "text-green-500" : "text-red-500"}>
        Backend Status: {backendStatus ? "OK" : "FAILED"}
      </Text>
    </div>
  );
}
