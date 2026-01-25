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

const StartupsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const startups = [
    {
      id: '1',
      name: 'TechVenture',
      industry: 'FinTech',
      description: 'Revolutionizing digital payments',
      positions: 5,
      location: 'Remote',
      logo: '💼',
    },
    {
      id: '2',
      name: 'DataFlow AI',
      industry: 'AI/ML',
      description: 'Building intelligent data solutions',
      positions: 3,
      location: 'Hybrid',
      logo: '🤖',
    },
    {
      id: '3',
      name: 'EduTech Solutions',
      industry: 'EdTech',
      description: 'Transforming online education',
      positions: 8,
      location: 'On-site',
      logo: '📚',
    },
    {
      id: '4',
      name: 'GreenTech Innovations',
      industry: 'CleanTech',
      description: 'Sustainable technology solutions',
      positions: 4,
      location: 'Remote',
      logo: '🌱',
    },
  ];

  const positions = [
    {
      id: '1',
      startupId: '1',
      startupName: 'TechVenture',
      title: 'Frontend Developer Intern',
      type: 'Internship',
      duration: '6 months',
      stipend: '$800/month',
      skills: ['React', 'JavaScript', 'CSS'],
    },
    {
      id: '2',
      startupId: '1',
      startupName: 'TechVenture',
      title: 'Backend Developer Intern',
      type: 'Internship',
      duration: '6 months',
      stipend: '$900/month',
      skills: ['Node.js', 'Python', 'MongoDB'],
    },
    {
      id: '3',
      startupId: '2',
      startupName: 'DataFlow AI',
      title: 'ML Engineer Intern',
      type: 'Internship',
      duration: '3 months',
      stipend: '$1000/month',
      skills: ['Python', 'TensorFlow', 'Data Science'],
    },
    {
      id: '4',
      startupId: '3',
      startupName: 'EduTech Solutions',
      title: 'UI/UX Designer',
      type: 'Part-time',
      duration: 'Flexible',
      stipend: '$700/month',
      skills: ['Figma', 'Design', 'Prototyping'],
    },
  ];

  const renderStartup = ({ item }) => (
    <TouchableOpacity style={styles.startupCard}>
      <View style={styles.startupHeader}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>{item.logo}</Text>
        </View>
        <View style={styles.startupInfo}>
          <Text style={styles.startupName}>{item.name}</Text>
          <Text style={styles.industry}>{item.industry}</Text>
        </View>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.startupDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="briefcase-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.positions} positions</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View Positions</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPosition = ({ item }) => (
    <TouchableOpacity style={styles.positionCard}>
      <View style={styles.positionHeader}>
        <View>
          <Text style={styles.positionTitle}>{item.title}</Text>
          <Text style={styles.positionCompany}>{item.startupName}</Text>
        </View>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
      </View>
      <View style={styles.positionDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.duration}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.stipend}</Text>
        </View>
      </View>
      <View style={styles.skillsContainer}>
        {item.skills.map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Apply Now</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search startups or positions..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>Startups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Positions</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={startups}
        renderItem={renderStartup}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Startups</Text>
          </View>
        }
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  sectionHeader: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listContainer: {
    padding: 15,
  },
  startupCard: {
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
  startupHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logo: {
    fontSize: 24,
  },
  startupInfo: {
    flex: 1,
  },
  startupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  industry: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  startupDetails: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  viewButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  positionCard: {
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
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  positionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  positionCompany: {
    fontSize: 14,
    color: '#666',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  positionDetails: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  skillTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 5,
  },
  skillText: {
    fontSize: 12,
    color: '#666',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default StartupsScreen;


