import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuthStore } from "@/store/authStore";

interface Agency {
  Id: string;
  Name: string;
}

export const useAgencies = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tokenData = useAuthStore((state) => state.tokenData);

  useEffect(() => {
    const fetchAgencies = async () => {
      if (!tokenData?.access_token) {
        setError("No access token available.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://bridgerins.my.salesforce.com/services/data/v57.0/query?q=SELECT+Id,Name+FROM+Account",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error_description || "Failed to fetch agencies."
          );
        }

        const data = await response.json();
        setAgencies(data.records || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          Alert.alert("Error", err.message);
        } else {
          setError("An unknown error occurred.");
          Alert.alert("Error", "An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, [tokenData]);

  return { agencies, loading, error };
};
