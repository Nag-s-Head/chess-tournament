import { apiClient } from "@/lib/api/api";

export const dynamic = "force-dynamic";

export default async function Page() {
  const backendStatus = await apiClient.health
    .getHealthCheck()
    .then(() => true)
    .catch((error: unknown) => {
      console.log("Cannot get backend status", error);
      return false;
    });

  return (
    <div>
      <h1>System Status</h1>
      <p className={backendStatus ? "text-green-500" : "text-red-500"}>
        Backend Status: {backendStatus ? "OK" : "FAILED"}
      </p>
    </div>
  );
}
