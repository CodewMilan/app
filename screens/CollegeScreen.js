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
import { useAuth } from '../contexts/AuthContext';
import theme from '../theme';

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
      case 'placement': return 'briefcase';
      case 'workshop': return 'book-open';
      case 'event': return 'calendar';
      case 'opportunity': return 'star';
      default: return 'info';
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
          <Feather name={getIcon(item.type)} size={24} color={theme.primary} />
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
          <Feather name="book-open" size={28} color={theme.primary} />
          <Text style={styles.headerTitle}>College Page</Text>
        </View>
        <Text style={styles.collegeName}>{collegeName}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Feather name="plus-circle" size={28} color={theme.textOnPrimary} />
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
            <Feather name="volume-2" size={64} color={theme.textMuted} />
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
                <Feather name="x" size={28} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Title" placeholderTextColor={theme.textMuted} value={title} onChangeText={setTitle} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Content (optional)"
              placeholderTextColor={theme.textMuted}
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
  container: { flex: 1, backgroundColor: theme.background },
  header: { backgroundColor: theme.surface, padding: 20, paddingTop: 30, borderBottomWidth: 1, borderBottomColor: theme.border },
  headerContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 24, fontFamily: theme.fontFamilyBold, color: theme.text, marginLeft: 10 },
  collegeName: { fontSize: 16, fontFamily: theme.fontFamily, color: theme.textSecondary, marginBottom: 12 },
  addButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, backgroundColor: theme.primary, borderRadius: theme.radius },
  addButtonText: { color: theme.textOnPrimary, marginLeft: 6, fontSize: 16, fontFamily: theme.fontFamilySemiBold },
  statsContainer: { flexDirection: 'row', backgroundColor: theme.surface, padding: 20, justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: theme.border },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontFamily: theme.fontFamilyBold, color: theme.primary },
  statLabel: { fontSize: 12, fontFamily: theme.fontFamily, color: theme.textSecondary, marginTop: 5 },
  sectionHeader: { padding: 15, backgroundColor: theme.surface, borderBottomWidth: 1, borderBottomColor: theme.border },
  sectionTitle: { fontSize: 18, fontFamily: theme.fontFamilySemiBold, color: theme.text },
  listContainer: { padding: 15 },
  announcementCard: {
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
  announcementHeader: { flexDirection: 'row', marginBottom: 10 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.inputBg, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  announcementContent: { flex: 1 },
  announcementTitle: { fontSize: 16, fontFamily: theme.fontFamilySemiBold, marginBottom: 4, color: theme.text },
  announcementDate: { fontSize: 12, fontFamily: theme.fontFamily, color: theme.textMuted },
  announcementText: { fontSize: 14, fontFamily: theme.fontFamily, color: theme.textSecondary, lineHeight: 20 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 18, fontFamily: theme.fontFamilySemiBold, color: theme.textSecondary, marginTop: 15 },
  emptySubtext: { fontSize: 14, fontFamily: theme.fontFamily, color: theme.textMuted, marginTop: 5 },
  modalOverlay: { flex: 1, backgroundColor: theme.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.surface, borderTopLeftRadius: theme.radiusXl, borderTopRightRadius: theme.radiusXl, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontFamily: theme.fontFamilyBold, color: theme.text },
  input: { borderWidth: 1, borderColor: theme.border, borderRadius: theme.radius, padding: 14, fontSize: 16, fontFamily: theme.fontFamily, marginBottom: 12, color: theme.text, backgroundColor: theme.inputBg },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  label: { fontSize: 14, fontFamily: theme.fontFamilySemiBold, color: theme.textSecondary, marginBottom: 8 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.inputBg, marginRight: 8, marginBottom: 8 },
  typeChipActive: { backgroundColor: theme.primary },
  typeChipText: { color: theme.textSecondary, fontSize: 14, fontFamily: theme.fontFamily },
  typeChipTextActive: { color: theme.textOnPrimary, fontFamily: theme.fontFamilySemiBold },
  saveButton: { backgroundColor: theme.primary, padding: 16, borderRadius: theme.radius, alignItems: 'center' },
  saveButtonText: { color: theme.textOnPrimary, fontFamily: theme.fontFamilySemiBold, fontSize: 16 },
});

export default CollegeScreen;
