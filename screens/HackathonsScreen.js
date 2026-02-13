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
import Feather from '@expo/vector-icons/Feather';
import theme from '../theme';

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
          <Feather name="calendar" size={16} color={theme.textSecondary} />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="map-pin" size={16} color={theme.textSecondary} />
          <Text style={styles.infoText}>{item.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="award" size={16} color={theme.primary} />
          <Text style={styles.infoText}>{item.prize} Prize Pool</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="users" size={16} color={theme.textSecondary} />
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
            <Feather name="filter" size={24} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => setModalVisible(true)}>
            <Feather name="plus-circle" size={24} color={theme.primary} />
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
            <Feather name="award" size={64} color={theme.textMuted} />
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
                <Feather name="x" size={28} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Title" placeholderTextColor={theme.textMuted} value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Date (e.g. March 15-17, 2024)" placeholderTextColor={theme.textMuted} value={date} onChangeText={setDate} />
            <TextInput style={styles.input} placeholder="Location (e.g. Online)" placeholderTextColor={theme.textMuted} value={location} onChangeText={setLocation} />
            <TextInput style={styles.input} placeholder="Prize (e.g. $10,000)" placeholderTextColor={theme.textMuted} value={prize} onChangeText={setPrize} />
            <TextInput style={styles.input} placeholder="Team size (e.g. 2-4 members)" placeholderTextColor={theme.textMuted} value={teamSize} onChangeText={setTeamSize} />
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
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerTitle: { fontSize: 24, fontFamily: theme.fontFamilyBold, color: theme.text },
  headerButtons: { flexDirection: 'row' },
  headerButton: { padding: 5, marginLeft: 10 },
  listContainer: { padding: 15 },
  hackathonCard: {
    backgroundColor: theme.card,
    padding: 15,
    marginBottom: 15,
    borderRadius: theme.radiusSm,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  hackathonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  hackathonTitle: { fontSize: 18, fontFamily: theme.fontFamilySemiBold, flex: 1, marginRight: 10, color: theme.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: theme.radius, backgroundColor: theme.inputBg },
  statusOngoing: { backgroundColor: theme.secondary },
  statusUpcoming: { backgroundColor: theme.primary },
  statusText: { color: theme.textOnPrimary, fontSize: 12, fontFamily: theme.fontFamilySemiBold },
  hackathonInfo: { marginBottom: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { marginLeft: 8, fontFamily: theme.fontFamily, color: theme.textSecondary, fontSize: 14 },
  actionButtons: { flexDirection: 'row', gap: 10 },
  viewButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.primary,
    borderRadius: theme.radiusSm,
    alignItems: 'center',
  },
  viewButtonText: { color: theme.primary, fontFamily: theme.fontFamilySemiBold },
  joinButton: { flex: 1, padding: 12, backgroundColor: theme.primary, borderRadius: theme.radiusSm, alignItems: 'center' },
  joinButtonText: { color: theme.textOnPrimary, fontFamily: theme.fontFamilySemiBold },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 18, fontFamily: theme.fontFamilySemiBold, color: theme.textSecondary, marginTop: 15 },
  emptySubtext: { fontSize: 14, fontFamily: theme.fontFamily, color: theme.textMuted, marginTop: 5 },
  filterOverlay: { flex: 1, backgroundColor: theme.overlay, justifyContent: 'center', padding: 20 },
  filterContent: { backgroundColor: theme.surface, borderRadius: theme.radiusLg, padding: 20 },
  filterTitle: { fontSize: 18, fontFamily: theme.fontFamilySemiBold, marginBottom: 16, color: theme.text },
  filterOption: { padding: 14, borderRadius: theme.radiusSm, marginBottom: 8, backgroundColor: theme.inputBg },
  filterOptionActive: { backgroundColor: theme.primary },
  filterOptionText: { fontSize: 16, fontFamily: theme.fontFamily, color: theme.text },
  filterOptionTextActive: { color: theme.textOnPrimary, fontFamily: theme.fontFamilySemiBold },
  filterCancel: { marginTop: 12, alignItems: 'center' },
  filterCancelText: { color: theme.textSecondary, fontSize: 16, fontFamily: theme.fontFamily },
  modalOverlay: { flex: 1, backgroundColor: theme.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.surface, borderTopLeftRadius: theme.radiusXl, borderTopRightRadius: theme.radiusXl, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontFamily: theme.fontFamilyBold, color: theme.text },
  input: { borderWidth: 1, borderColor: theme.border, borderRadius: theme.radius, padding: 14, fontSize: 16, fontFamily: theme.fontFamily, marginBottom: 12, color: theme.text, backgroundColor: theme.inputBg },
  label: { fontSize: 14, fontFamily: theme.fontFamilySemiBold, color: theme.textSecondary, marginBottom: 8 },
  statusRow: { flexDirection: 'row', marginBottom: 20 },
  statusChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.inputBg, marginRight: 8 },
  statusChipActive: { backgroundColor: theme.primary },
  statusChipText: { color: theme.textSecondary, fontSize: 14, fontFamily: theme.fontFamily },
  statusChipTextActive: { color: theme.textOnPrimary, fontFamily: theme.fontFamilySemiBold },
  saveButton: { backgroundColor: theme.primary, padding: 16, borderRadius: theme.radius, alignItems: 'center' },
  saveButtonText: { color: theme.textOnPrimary, fontFamily: theme.fontFamilySemiBold, fontSize: 16 },
});

export default HackathonsScreen;
