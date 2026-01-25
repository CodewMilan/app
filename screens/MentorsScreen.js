import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MentorsScreen = () => {
  const [selectedDomain, setSelectedDomain] = useState('All');

  const domains = ['All', 'Web Development', 'Mobile Dev', 'AI/ML', 'Data Science', 'Design'];

  const mentors = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      domain: 'AI/ML',
      experience: '10+ years',
      expertise: 'Machine Learning, Deep Learning',
      rating: 4.8,
      students: 150,
      bio: 'Senior AI researcher with expertise in neural networks and computer vision.',
    },
    {
      id: '2',
      name: 'Michael Chen',
      domain: 'Web Development',
      experience: '8+ years',
      expertise: 'React, Node.js, Full Stack',
      rating: 4.9,
      students: 200,
      bio: 'Full-stack developer and tech lead at a Fortune 500 company.',
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      domain: 'Mobile Dev',
      experience: '7+ years',
      expertise: 'React Native, Flutter, iOS',
      rating: 4.7,
      students: 120,
      bio: 'Mobile app developer with experience in both iOS and Android platforms.',
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      domain: 'Data Science',
      experience: '12+ years',
      expertise: 'Python, R, Big Data',
      rating: 4.9,
      students: 180,
      bio: 'Data scientist and professor specializing in predictive analytics.',
    },
  ];

  const filteredMentors =
    selectedDomain === 'All'
      ? mentors
      : mentors.filter((m) => m.domain === selectedDomain);

  const renderMentor = ({ item }) => (
    <TouchableOpacity style={styles.mentorCard}>
      <View style={styles.mentorHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name[0]}</Text>
        </View>
        <View style={styles.mentorInfo}>
          <Text style={styles.mentorName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.students}>({item.students} students)</Text>
          </View>
        </View>
      </View>
      <View style={styles.domainBadge}>
        <Text style={styles.domainText}>{item.domain}</Text>
      </View>
      <Text style={styles.experience}>{item.experience} experience</Text>
      <Text style={styles.expertise}>{item.expertise}</Text>
      <Text style={styles.bio}>{item.bio}</Text>
      <TouchableOpacity style={styles.requestButton}>
        <Text style={styles.requestButtonText}>Request Mentorship</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search mentors..."
          placeholderTextColor="#999"
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.domainScroll}
        contentContainerStyle={styles.domainContainer}
      >
        {domains.map((domain) => (
          <TouchableOpacity
            key={domain}
            style={[
              styles.domainChip,
              selectedDomain === domain && styles.domainChipActive,
            ]}
            onPress={() => setSelectedDomain(domain)}
          >
            <Text
              style={[
                styles.domainChipText,
                selectedDomain === domain && styles.domainChipTextActive,
              ]}
            >
              {domain}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={filteredMentors}
        renderItem={renderMentor}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  domainScroll: {
    maxHeight: 50,
  },
  domainContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  domainChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  domainChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  domainChipText: {
    color: '#666',
    fontSize: 14,
  },
  domainChipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  mentorCard: {
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
  mentorHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
  students: {
    marginLeft: 5,
    color: '#666',
    fontSize: 12,
  },
  domainBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  domainText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  experience: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  expertise: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  requestButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MentorsScreen;


