import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const statusOptions = ['All', 'Upcoming', 'Ongoing'];

const HackathonsScreen = () => {
  const [hackathons, setHackathons] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [prize, setPrize] = useState('');
  const [status, setStatus] = useState('Upcoming');
  const [teamSize, setTeamSize] = useState('2-4 members');

  const filteredList =
    filterStatus === 'All'
      ? hackathons
      : hackathons.filter((h) => h.status === filterStatus);

  const handleAddHackathon = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    setHackathons([
      ...hackathons,
      {
        id: Date.now().toString(),
        title: title.trim(),
        date: date.trim() || 'TBD',
        location: location.trim() || 'TBD',
        prize: prize.trim() || 'TBD',
        participants: 0,
        status,
        teamSize: teamSize.trim() || '2-4 members',
      },
    ]);
    setTitle('');
    setDate('');
    setLocation('');
    setPrize('');
    setStatus('Upcoming');
    setTeamSize('2-4 members');
    setModalVisible(false);
  };

  const handleViewDetails = (item) => {
    Alert.alert(
      item.title,
      `Date: ${item.date}\nLocation: ${item.location}\nPrize: ${item.prize}\nTeam size: ${item.teamSize}\nStatus: ${item.status}`,
      [{ text: 'OK' }]
    );
  };

  const handleJoinTeam = (item) => {
    Alert.alert('Join Team', `Join request sent for "${item.title}". You'll be notified when a team responds.`, [{ text: 'OK' }]);
  };

  const renderHackathon = ({ item }) => (
    <View style={styles.hackathonCard}>
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
          <Text style={styles.infoText}>{item.teamSize}</Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.viewButton} onPress={() => handleViewDetails(item)}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.joinButton} onPress={() => handleJoinTeam(item)}>
          <Text style={styles.joinButtonText}>Join Team</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hackathons</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setFilterModalVisible(true)}>
            <Ionicons name="filter-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={filteredList}
        renderItem={renderHackathon}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hackathons yet</Text>
            <Text style={styles.emptySubtext}>Tap + to add one, or check back later</Text>
          </View>
        }
      />

      <Modal visible={filterModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.filterOverlay}
          activeOpacity={1}
          onPress={() => setFilterModalVisible(false)}
        >
          <View style={styles.filterContent}>
            <Text style={styles.filterTitle}>Filter by status</Text>
            {statusOptions.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.filterOption, filterStatus === s && styles.filterOptionActive]}
                onPress={() => {
                  setFilterStatus(s);
                  setFilterModalVisible(false);
                }}
              >
                <Text style={[styles.filterOptionText, filterStatus === s && styles.filterOptionTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.filterCancel} onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.filterCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Hackathon</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Title" placeholderTextColor="#999" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Date (e.g. March 15-17, 2024)" placeholderTextColor="#999" value={date} onChangeText={setDate} />
            <TextInput style={styles.input} placeholder="Location (e.g. Online)" placeholderTextColor="#999" value={location} onChangeText={setLocation} />
            <TextInput style={styles.input} placeholder="Prize (e.g. $10,000)" placeholderTextColor="#999" value={prize} onChangeText={setPrize} />
            <TextInput style={styles.input} placeholder="Team size (e.g. 2-4 members)" placeholderTextColor="#999" value={teamSize} onChangeText={setTeamSize} />
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusRow}>
              {['Upcoming', 'Ongoing'].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.statusChip, status === s && styles.statusChipActive]}
                  onPress={() => setStatus(s)}
                >
                  <Text style={[styles.statusChipText, status === s && styles.statusChipTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddHackathon}>
              <Text style={styles.saveButtonText}>Add Hackathon</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerButtons: { flexDirection: 'row' },
  headerButton: { padding: 5, marginLeft: 10 },
  listContainer: { padding: 15 },
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
  hackathonTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, marginRight: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: '#e0e0e0' },
  statusOngoing: { backgroundColor: '#4CAF50' },
  statusUpcoming: { backgroundColor: '#2196F3' },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  hackathonInfo: { marginBottom: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { marginLeft: 8, color: '#666', fontSize: 14 },
  actionButtons: { flexDirection: 'row', gap: 10 },
  viewButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: { color: '#007AFF', fontWeight: 'bold' },
  joinButton: { flex: 1, padding: 12, backgroundColor: '#007AFF', borderRadius: 8, alignItems: 'center' },
  joinButtonText: { color: '#fff', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#666', marginTop: 15 },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 5 },
  filterOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  filterContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  filterTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  filterOption: { padding: 14, borderRadius: 8, marginBottom: 8, backgroundColor: '#f5f5f5' },
  filterOptionActive: { backgroundColor: '#007AFF' },
  filterOptionText: { fontSize: 16, color: '#333' },
  filterOptionTextActive: { color: '#fff', fontWeight: 'bold' },
  filterCancel: { marginTop: 12, alignItems: 'center' },
  filterCancelText: { color: '#666', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 },
  statusRow: { flexDirection: 'row', marginBottom: 20 },
  statusChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 8 },
  statusChipActive: { backgroundColor: '#007AFF' },
  statusChipText: { color: '#666', fontSize: 14 },
  statusChipTextActive: { color: '#fff', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default HackathonsScreen;
