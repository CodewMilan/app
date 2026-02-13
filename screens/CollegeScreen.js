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
import { useAuth } from '../contexts/AuthContext';

const typeOptions = [
  { key: 'placement', label: 'Placement' },
  { key: 'workshop', label: 'Workshop' },
  { key: 'event', label: 'Event' },
  { key: 'opportunity', label: 'Opportunity' },
  { key: 'general', label: 'General' },
];

const CollegeScreen = () => {
  const { user } = useAuth();
  const collegeName = user?.user_metadata?.college || 'Your College';
  const [announcements, setAnnouncements] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('general');

  const getIcon = (t) => {
    switch (t) {
      case 'placement': return 'briefcase-outline';
      case 'workshop': return 'school-outline';
      case 'event': return 'calendar-outline';
      case 'opportunity': return 'star-outline';
      default: return 'information-circle-outline';
    }
  };

  const handleAddAnnouncement = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    setAnnouncements([
      ...announcements,
      {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim() || 'No details.',
        date: 'Just now',
        type,
      },
    ]);
    setTitle('');
    setContent('');
    setType('general');
    setModalVisible(false);
  };

  const handleAnnouncementPress = (item) => {
    Alert.alert(item.title, item.content, [{ text: 'OK' }]);
  };

  const renderAnnouncement = ({ item }) => (
    <TouchableOpacity style={styles.announcementCard} onPress={() => handleAnnouncementPress(item)} activeOpacity={0.7}>
      <View style={styles.announcementHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name={getIcon(item.type)} size={24} color="#007AFF" />
        </View>
        <View style={styles.announcementContent}>
          <Text style={styles.announcementTitle}>{item.title}</Text>
          <Text style={styles.announcementDate}>{item.date}</Text>
        </View>
      </View>
      <Text style={styles.announcementText} numberOfLines={2}>{item.content}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="school" size={28} color="#007AFF" />
          <Text style={styles.headerTitle}>College Page</Text>
        </View>
        <Text style={styles.collegeName}>{collegeName}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={28} color="#fff" />
          <Text style={styles.addButtonText}>Add announcement</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{announcements.length}</Text>
          <Text style={styles.statLabel}>Announcements</Text>
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="megaphone-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No announcements yet</Text>
            <Text style={styles.emptySubtext}>Tap "Add announcement" to post one</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Announcement</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Title" placeholderTextColor="#999" value={title} onChangeText={setTitle} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Content (optional)"
              placeholderTextColor="#999"
              value={content}
              onChangeText={setContent}
              multiline
            />
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeRow}>
              {typeOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.typeChip, type === opt.key && styles.typeChipActive]}
                  onPress={() => setType(opt.key)}
                >
                  <Text style={[styles.typeChipText, type === opt.key && styles.typeChipTextActive]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddAnnouncement}>
              <Text style={styles.saveButtonText}>Post Announcement</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#007AFF', padding: 20, paddingTop: 30 },
  headerContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginLeft: 10 },
  collegeName: { fontSize: 16, color: '#fff', opacity: 0.9, marginBottom: 12 },
  addButton: { flexDirection: 'row', alignItems: 'center' },
  addButtonText: { color: '#fff', marginLeft: 6, fontSize: 16 },
  statsContainer: { flexDirection: 'row', backgroundColor: '#fff', padding: 20, justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#007AFF' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 5 },
  sectionHeader: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  listContainer: { padding: 15 },
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
  announcementHeader: { flexDirection: 'row', marginBottom: 10 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  announcementContent: { flex: 1 },
  announcementTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  announcementDate: { fontSize: 12, color: '#999' },
  announcementText: { fontSize: 14, color: '#666', lineHeight: 20 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#666', marginTop: 15 },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 8, marginBottom: 8 },
  typeChipActive: { backgroundColor: '#007AFF' },
  typeChipText: { color: '#666', fontSize: 14 },
  typeChipTextActive: { color: '#fff', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CollegeScreen;
