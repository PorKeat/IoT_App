import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function AboutScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#4A90E2', dark: '#2C5282' }}
      headerImage={
        <Image
          source={require('@/assets/images/smart_garage_landscape.png')}
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About Smart Garage</ThemedText>
      </ThemedView>
      <ThemedText>
        An innovative IoT project developed by TGI students to revolutionize garage management 
        through smart automation and monitoring systems.
      </ThemedText>
      
      <Collapsible title="Project Overview">
        <ThemedText>
          The <ThemedText type="defaultSemiBold">Smart Garage</ThemedText> project integrates 
          Internet of Things (IoT) technology to create an intelligent garage system that 
          provides automated door control, security monitoring, and real-time status updates.
        </ThemedText>
        <ThemedText>
          This project demonstrates practical application of IoT concepts, sensor integration, 
          mobile app development, and cloud connectivity in a real-world scenario.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Instructor">
        <ThemedView style={styles.instructorContainer}>
          <IconSymbol size={24} color="#4A90E2" name="person.circle" />
          <ThemedText type="defaultSemiBold" style={styles.instructorName}>
            Manith
          </ThemedText>
        </ThemedView>
        <ThemedText>
          Project supervisor and mentor, guiding the team through the development process 
          and providing technical expertise in IoT implementation.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Team Members">
        <ThemedView style={styles.teamContainer}>
          <ThemedView style={styles.memberItem}>
            <IconSymbol size={20} color="#34D399" name="person.fill" />
            <ThemedText type="defaultSemiBold">Molika</ThemedText>
          </ThemedView>
          <ThemedView style={styles.memberItem}>
            <IconSymbol size={20} color="#34D399" name="person.fill" />
            <ThemedText type="defaultSemiBold">Porkeat</ThemedText>
          </ThemedView>
          <ThemedView style={styles.memberItem}>
            <IconSymbol size={20} color="#34D399" name="person.fill" />
            <ThemedText type="defaultSemiBold">LySang</ThemedText>
          </ThemedView>
          <ThemedView style={styles.memberItem}>
            <IconSymbol size={20} color="#34D399" name="person.fill" />
            <ThemedText type="defaultSemiBold">KimLong</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedText>
          Our dedicated team of four students collaborated to design, develop, and implement 
          this Smart Garage IoT solution, each contributing unique skills and perspectives.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Key Features">
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Automated Door Control:</ThemedText> Remote opening 
          and closing via mobile app
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Security Monitoring:</ThemedText> Real-time alerts 
          and surveillance capabilities
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Status Tracking:</ThemedText> Live updates on 
          garage door position and vehicle presence
        </ThemedText>
        <ThemedText>
          • <ThemedText type="defaultSemiBold">Smart Notifications:</ThemedText> Push notifications 
          for important events and status changes
        </ThemedText>
      </Collapsible>

      <Collapsible title="Technology Stack">
        <ThemedText>
          This project utilizes modern IoT technologies including microcontrollers, sensors, 
          wireless communication protocols, and cloud services to create a comprehensive 
          smart garage solution.
        </ThemedText>
        <ThemedText>
          The mobile application is built using <ThemedText type="defaultSemiBold">React Native</ThemedText> 
          and <ThemedText type="defaultSemiBold">Expo</ThemedText>, ensuring cross-platform 
          compatibility and smooth user experience.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Academic Institution">
        <ThemedText>
          Developed as part of the curriculum at <ThemedText type="defaultSemiBold">TGI 
          (TUX Global Institute)</ThemedText>, this project represents the 
          practical application of theoretical knowledge in IoT and mobile development.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: 310,
    bottom: 0,
    left: 0,
    position: 'absolute',
    resizeMode: 'cover',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  instructorName: {
    fontSize: 18,
  },
  teamContainer: {
    marginBottom: 12,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
});