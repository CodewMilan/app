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

const HackathonsScreen = () => {
  const hackathons = [
    {
      id: '1',
      title: 'AI Innovation Challenge 2024',
      date: 'March 15-17, 2024',
      location: 'Online',
      prize: '$10,000',
      participants: 250,
      status: 'Upcoming',
      teamSize: '2-4 members',
    },
    {
      id: '2',
      title: 'Web3 Development Hackathon',
      date: 'March 20-22, 2024',
      location: 'Hybrid',
      prize: '$15,000',
      participants: 180,
      status: 'Upcoming',
      teamSize: '3-5 members',
    },
    {
      id: '3',
      title: 'Mobile App Design Contest',
      date: 'Feb 28 - Mar 2, 2024',
      location: 'On-site',
      prize: '$8,000',
      participants: 120,
      status: 'Ongoing',
      teamSize: '1-3 members',
    },
  ];

  const renderHackathon = ({ item }) => (
    <TouchableOpacity style={styles.hackathonCard}>
      <View style={styles.hackathonHeader}>
        <Text style={styles.hackathonTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === 'Ongoing' && styles.statusOngoing,
            item.status === 'Upcoming' && styles.statusUpcoming,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.hackathonInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="trophy-outline" size={16} color="#FFD700" />
          <Text style={styles.infoText}>{item.prize} Prize Pool</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.infoText}>
            {item.participants} participants • {item.teamSize}
          </Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join Team</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hackathons</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={hackathons}
        renderItem={renderHackathon}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 5,
  },
  listContainer: {
    padding: 15,
  },
  hackathonCard: {
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
  hackathonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  hackathonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  statusOngoing: {
    backgroundColor: '#4CAF50',
  },
  statusUpcoming: {
    backgroundColor: '#2196F3',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  hackathonInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  viewButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  joinButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HackathonsScreen;




