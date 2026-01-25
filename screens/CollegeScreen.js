import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CollegeScreen = () => {
  const announcements = [
    {
      id: '1',
      title: 'Placement Drive - Tech Companies',
      content: 'Major tech companies visiting campus next week. Register now!',
      date: '2 days ago',
      type: 'placement',
    },
    {
      id: '2',
      title: 'Workshop: Machine Learning Basics',
      content: 'Free workshop on ML fundamentals this Saturday at 10 AM.',
      date: '3 days ago',
      type: 'workshop',
    },
    {
      id: '3',
      title: 'College Fest 2024',
      content: 'Annual college fest starting next month. Early bird registrations open.',
      date: '5 days ago',
      type: 'event',
    },
    {
      id: '4',
      title: 'Internship Opportunities',
      content: 'Multiple internship positions available. Check the careers section.',
      date: '1 week ago',
      type: 'opportunity',
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'placement':
        return 'briefcase-outline';
      case 'workshop':
        return 'school-outline';
      case 'event':
        return 'calendar-outline';
      case 'opportunity':
        return 'star-outline';
      default:
        return 'information-circle-outline';
    }
  };

  const renderAnnouncement = ({ item }) => (
    <TouchableOpacity style={styles.announcementCard}>
      <View style={styles.announcementHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name={getIcon(item.type)} size={24} color="#007AFF" />
        </View>
        <View style={styles.announcementContent}>
          <Text style={styles.announcementTitle}>{item.title}</Text>
          <Text style={styles.announcementDate}>{item.date}</Text>
        </View>
      </View>
      <Text style={styles.announcementText}>{item.content}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="school" size={28} color="#007AFF" />
          <Text style={styles.headerTitle}>College Page</Text>
        </View>
        <Text style={styles.collegeName}>Your College</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1,250</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>45</Text>
          <Text style={styles.statLabel}>Projects</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Hackathons</Text>
        </View>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Announcements & Events</Text>
      </View>
      <FlatList
        data={announcements}
        renderItem={renderAnnouncement}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  collegeName: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  sectionHeader: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  announcementCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  announcementHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  announcementContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  announcementDate: {
    fontSize: 12,
    color: '#999',
  },
  announcementText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default CollegeScreen;


