import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";

export default function SmartGarageApp(): JSX.Element {
  const [isGarageOpen, setIsGarageOpen] = useState<boolean>(false);
  const [isLedOn, setIsLedOn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [garageCountdown, setGarageCountdown] = useState<number>(0);
  const [ledCountdown, setLedCountdown] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusColor, setStatusColor] = useState<string>("#6b7280");

  const API_CONFIG = {
    apiKey: "2GFHPT1S2DZLVPHH",
    garageField: "field1",
    ledField: "field2"
  };

  const CHANNEL_ID = "2987995";

  useEffect(() => {
    fetchCurrentStatus();
  }, []);

  const fetchCurrentStatus = async () => {
    try {
      const response = await fetch(`https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json`);
      const data = await response.json();
      setIsGarageOpen(data.field1 === "1");
      setIsLedOn(data.field2 === "1");
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  const countdownTimer = async (setCountdown: React.Dispatch<React.SetStateAction<number>>) => {
    return new Promise<void>((resolve) => {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            resolve();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });
  };

  const toggleGarage = async () => {
    if (isLoading) return;
    const garageValue = !isGarageOpen ? 1 : 0;
    const url = `https://api.thingspeak.com/update?api_key=${API_CONFIG.apiKey}&${API_CONFIG.garageField}=${garageValue}&${API_CONFIG.ledField}=${isLedOn ? 1 : 0}`;

    setIsLoading(true);
    setGarageCountdown(16);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.text();

      if (parseInt(data) > 0) {
        setIsGarageOpen(!isGarageOpen);
        setStatusMessage(`Garage ${!isGarageOpen ? "opened" : "closed"} successfully`);
        setStatusColor("#10b981");
        await countdownTimer(setGarageCountdown);
        await fetchCurrentStatus();
      } else {
        throw new Error("Failed to update ThingSpeak");
      }
    } catch (error: any) {
      setStatusMessage(`Error: ${error.message}`);
      setStatusColor("#ef4444");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLed = async (value: boolean) => {
    if (isLoading) return;
    const url = `https://api.thingspeak.com/update?api_key=${API_CONFIG.apiKey}&${API_CONFIG.garageField}=${isGarageOpen ? 1 : 0}&${API_CONFIG.ledField}=${value ? 1 : 0}`;

    setIsLoading(true);
    setLedCountdown(16);
    const previousLedState = isLedOn;

    try {
      setIsLedOn(value);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.text();

      if (parseInt(data) > 0) {
        setStatusMessage(`LED turned ${value ? "on" : "off"} successfully`);
        setStatusColor("#10b981");
        await countdownTimer(setLedCountdown);
        await fetchCurrentStatus();
      } else {
        throw new Error("Failed to update ThingSpeak");
      }
    } catch (error: any) {
      setIsLedOn(previousLedState);
      setStatusMessage(`Error: ${error.message}`);
      setStatusColor("#ef4444");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Smart Garage</Text>

      <View style={styles.section}>
        <Text style={styles.statusLabel}>Garage Door</Text>
        <Text style={[styles.statusValue, { color: isGarageOpen ? "#10b981" : "#ef4444" }]}> {isGarageOpen ? "Open" : "Closed"} </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isGarageOpen ? "#ef4444" : "#10b981" }]}
          onPress={toggleGarage}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isGarageOpen ? "Close" : "Open"}</Text>}
        </TouchableOpacity>
        {garageCountdown > 0 && <Text style={styles.processing}>Processing... ({garageCountdown}s)</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.statusLabel}>Garage Light</Text>
        <Text style={[styles.statusValue, { color: isLedOn ? "#3b82f6" : "#94a3b8" }]}> {isLedOn ? "On" : "Off"} </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isLedOn ? "#3b82f6" : "#e5e7eb" }]}
          onPress={() => toggleLed(!isLedOn)}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color={isLedOn ? "#fff" : "#000"} /> : <Text style={[styles.buttonText, { color: isLedOn ? "#fff" : "#000" }]}>Toggle</Text>}
        </TouchableOpacity>
        {ledCountdown > 0 && <Text style={styles.processing}>Processing... ({ledCountdown}s)</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.statusLabel}>System Status</Text>
        <Text style={[styles.statusValue, { color: statusColor }]}>{statusMessage || "No recent activity"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f1f5f9",
    flexGrow: 1
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12
  },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center"
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600"
  },
  processing: {
    marginTop: 8,
    fontSize: 14,
    color: "#64748b"
  }
});
