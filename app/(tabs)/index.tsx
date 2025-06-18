import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView,
  Animated,
  Easing
} from "react-native";

export default function SmartGarageApp() {
  const [isGarageOpen, setIsGarageOpen] = useState(false);
  const [isLedOn, setIsLedOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [garageCountdown, setGarageCountdown] = useState(0);
  const [ledCountdown, setLedCountdown] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusColor, setStatusColor] = useState("#6b7280");

  // Animation values
  const fadeAnim = new Animated.Value(1);
  const scaleAnim = new Animated.Value(1);

  const API_CONFIG = {
    apiKey: "2GFHPT1S2DZLVPHH",
    garageField: "field1",
    ledField: "field2"
  };

  const CHANNEL_ID = "2987995";

  useEffect(() => {
    fetchCurrentStatus();
    // Fade in animation on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
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

  const countdownTimer = async (setCountdown) => {
    return new Promise((resolve) => {
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

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleGarage = async () => {
    if (isLoading) return;
    animatePress();
    
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
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
      setStatusColor("#ef4444");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLed = async (value) => {
    if (isLoading) return;
    animatePress();
    
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
    } catch (error) {
      setIsLedOn(previousLedState);
      setStatusMessage(`Error: ${error.message}`);
      setStatusColor("#ef4444");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Smart Garage</Text>
          <View style={styles.divider} />
        </View>

        {/* Garage Door Section */}
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Garage Door</Text>
              <View style={styles.statusRow}>
                <View style={[
                  styles.statusDot, 
                  { backgroundColor: isGarageOpen ? '#10b981' : '#ef4444' }
                ]} />
                <Text style={[
                  styles.statusText,
                  { color: isGarageOpen ? '#10b981' : '#ef4444' }
                ]}>
                  {isGarageOpen ? 'Open' : 'Closed'}
                </Text>
              </View>
            </View>
            <Text style={styles.icon}>{isGarageOpen ? '🔓' : '🔒'}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              isLoading && styles.disabledButton
            ]}
            onPress={toggleGarage}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.loadingText}>Processing...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>
                {isGarageOpen ? 'Close Door' : 'Open Door'}
              </Text>
            )}
          </TouchableOpacity>

          {garageCountdown > 0 && (
            <View style={styles.countdownContainer}>
              <ActivityIndicator size="small" color="#6b7280" />
              <Text style={styles.countdownText}>
                Processing in {garageCountdown}s
              </Text>
            </View>
          )}
        </Animated.View>

        {/* LED Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Garage Light</Text>
              <View style={styles.statusRow}>
                <View style={[
                  styles.statusDot, 
                  { backgroundColor: isLedOn ? '#3b82f6' : '#d1d5db' }
                ]} />
                <Text style={[
                  styles.statusText,
                  { color: isLedOn ? '#3b82f6' : '#6b7280' }
                ]}>
                  {isLedOn ? 'On' : 'Off'}
                </Text>
              </View>
            </View>
            <Text style={styles.icon}>{isLedOn ? '💡' : '🔅'}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              isLedOn ? styles.secondaryButton : styles.primaryButton,
              isLoading && styles.disabledButton
            ]}
            onPress={() => toggleLed(!isLedOn)}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator 
                  size="small" 
                  color={isLedOn ? "#3b82f6" : "#ffffff"} 
                />
                <Text style={[
                  styles.loadingText,
                  { color: isLedOn ? "#3b82f6" : "#ffffff" }
                ]}>
                  Processing...
                </Text>
              </View>
            ) : (
              <Text style={[
                styles.buttonText,
                { color: isLedOn ? '#3b82f6' : '#ffffff' }
              ]}>
                {isLedOn ? 'Turn Off' : 'Turn On'}
              </Text>
            )}
          </TouchableOpacity>

          {ledCountdown > 0 && (
            <View style={styles.countdownContainer}>
              <ActivityIndicator size="small" color="#6b7280" />
              <Text style={styles.countdownText}>
                Processing in {ledCountdown}s
              </Text>
            </View>
          )}
        </View>

        {/* Status Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Status</Text>
          <View style={styles.statusRow}>
            <View style={[
              styles.statusDot,
              { 
                backgroundColor: statusMessage.includes('Error') ? '#ef4444' : 
                               statusMessage.includes('successfully') ? '#10b981' : 
                               '#d1d5db'
              }
            ]} />
            <Text style={[
              styles.statusMessage,
              { 
                color: statusMessage.includes('Error') ? '#ef4444' : 
                      statusMessage.includes('successfully') ? '#10b981' : 
                      '#6b7280'
              }
            ]}>
              {statusMessage || 'No recent activity'}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Smart Home Control Panel</Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    flexGrow: 1,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#1f2937',
    letterSpacing: 1,
    marginBottom: 12,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  icon: {
    fontSize: 24,
    marginLeft: 16,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: '#1f2937',
  },
  secondaryButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  disabledButton: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e5e7eb',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  countdownText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  statusMessage: {
    fontSize: 14,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '300',
  },
});