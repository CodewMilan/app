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

const statusOptions = ['Planning', 'In Progress', 'Completed'];

const ProjectsScreen = () => {
  const [projects, setProjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Planning');

  const handleAddProject = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a project title');
      return;
    }
    setProjects([
      ...projects,
      {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim() || 'No description',
        members: 1,
        status,
        progress: status === 'Completed' ? 100 : status === 'In Progress' ? 50 : 20,
      },
    ]);
    setTitle('');
    setDescription('');
    setStatus('Planning');
    setModalVisible(false);
  };

  const handleProjectPress = (item) => {
    Alert.alert(
      item.title,
      `${item.description}\n\nStatus: ${item.status}\nProgress: ${item.progress}%\nMembers: ${item.members}`,
      [{ text: 'OK' }]
    );
  };

  const renderProject = ({ item }) => (
    <TouchableOpacity style={styles.projectCard} onPress={() => handleProjectPress(item)} activeOpacity={0.7}>
      <View style={styles.projectHeader}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === 'In Progress' && styles.statusInProgress,
            item.status === 'Planning' && styles.statusPlanning,
            item.status === 'Completed' && styles.statusCompleted,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.projectDescription} numberOfLines={2}>{item.description}</Text>
      <View style={styles.projectInfo}>
          <View style={styles.infoItem}>
          <Feather name="users" size={16} color={theme.textSecondary} />
          <Text style={styles.infoText}>{item.members} members</Text>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${item.progress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Projects</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Feather name="plus-circle" size={28} color={theme.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="folder" size={64} color={theme.textMuted} />
            <Text style={styles.emptyText}>No projects yet</Text>
            <Text style={styles.emptySubtext}>
              Tap + to create your first project
            </Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Project</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={28} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Project title"
              placeholderTextColor={theme.textMuted}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              placeholderTextColor={theme.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusRow}>
              {statusOptions.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.statusChip, status === s && styles.statusChipActive]}
                  onPress={() => setStatus(s)}
                >
                  <Text style={[styles.statusChipText, status === s && styles.statusChipTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddProject}>
              <Text style={styles.saveButtonText}>Add Project</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: theme.fontFamilyBold,
    color: theme.text,
  },
  addButton: {
    padding: 5,
  },
  listContainer: {
    padding: 15,
  },
  projectCard: {
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
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 18,
    fontFamily: theme.fontFamilySemiBold,
    flex: 1,
    color: theme.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius,
    backgroundColor: theme.inputBg,
  },
  statusInProgress: {
    backgroundColor: theme.secondary,
  },
  statusPlanning: {
    backgroundColor: theme.warning,
  },
  statusCompleted: {
    backgroundColor: theme.primary,
  },
  statusText: {
    color: theme.textOnPrimary,
    fontSize: 12,
    fontFamily: theme.fontFamilySemiBold,
  },
  projectDescription: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 15,
    lineHeight: 20,
  },
  projectInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  infoText: {
    marginLeft: 5,
    color: theme.textSecondary,
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.inputBg,
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: theme.fontFamily,
    color: theme.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textSecondary,
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.textMuted,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: theme.radiusXl,
    borderTopRightRadius: theme.radiusXl,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: theme.fontFamilyBold,
    color: theme.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.radius,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    fontFamily: theme.fontFamily,
    color: theme.text,
    backgroundColor: theme.inputBg,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontFamily: theme.fontFamilySemiBold,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.inputBg,
    marginRight: 8,
    marginBottom: 8,
  },
  statusChipActive: {
    backgroundColor: theme.primary,
  },
  statusChipText: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  statusChipTextActive: {
    color: theme.textOnPrimary,
    fontFamily: theme.fontFamilySemiBold,
  },
  saveButton: {
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: theme.radius,
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.textOnPrimary,
    fontFamily: theme.fontFamilySemiBold,
    fontSize: 16,
  },
});

export default ProjectsScreen;
