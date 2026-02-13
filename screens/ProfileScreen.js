import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const SKILLS_API_URL = 'https://api.stackexchange.com/2.3/tags?page=1&pagesize=150&order=desc&sort=popular&site=stackoverflow';
const FALLBACK_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'HTML', 'CSS', 'SQL', 'Git',
  'React Native', 'MongoDB', 'Express', 'REST API', 'GraphQL', 'AWS', 'Docker', 'Linux', 'C++', 'C#',
  'Swift', 'Kotlin', 'Flutter', 'Redux', 'Vue.js', 'Angular', 'PHP', 'Ruby', 'Go', 'Rust',
  'Machine Learning', 'Data Science', 'TensorFlow', 'PyTorch', 'UI/UX', 'Figma', 'Agile', 'Scrum',
  'Communication', 'Problem Solving', 'Teamwork', 'Leadership', 'Project Management',
];

const ProfileScreen = () => {
  const { signOut, user, updateProfile } = useAuth();
  const metadata = user?.user_metadata || {};
  const fullName = metadata.full_name || user?.email?.split('@')[0] || 'User';
  const college = metadata.college || '—';
  const bio = metadata.bio || '';
  const skills = Array.isArray(metadata.skills) ? metadata.skills : [];
  const socialLinks = metadata.social_links || {};
  const github = socialLinks.github || '';
  const linkedin = socialLinks.linkedin || '';
  const portfolio = socialLinks.portfolio || '';

  const initials = fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const stats = { streak: 0, projects: 0, hackathons: 0, posts: 0 };

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFullName, setEditFullName] = useState(fullName);
  const [editCollege, setEditCollege] = useState(college);
  const [editBio, setEditBio] = useState(bio);
  const [editSaving, setEditSaving] = useState(false);

  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [allSkills, setAllSkills] = useState(FALLBACK_SKILLS);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillSearch, setSkillSearch] = useState('');
  const [skillSaving, setSkillSaving] = useState(false);

  const [socialModalVisible, setSocialModalVisible] = useState(false);
  const [editGithub, setEditGithub] = useState(github);
  const [editLinkedin, setEditLinkedin] = useState(linkedin);
  const [editPortfolio, setEditPortfolio] = useState(portfolio);
  const [socialSaving, setSocialSaving] = useState(false);

  useEffect(() => {
    setEditFullName(metadata.full_name || user?.email?.split('@')[0] || '');
    setEditCollege(metadata.college || '');
    setEditBio(metadata.bio || '');
    setEditGithub(socialLinks.github || '');
    setEditLinkedin(socialLinks.linkedin || '');
    setEditPortfolio(socialLinks.portfolio || '');
  }, [user, metadata.full_name, metadata.college, metadata.bio, socialLinks.github, socialLinks.linkedin, socialLinks.portfolio]);

  useEffect(() => {
    if (!skillModalVisible) return;
    setSkillsLoading(true);
    fetch(SKILLS_API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data?.items?.length) {
          const names = data.items.map((t) => t.name).filter(Boolean);
          const combined = [...new Set([...names.map((n) => n.charAt(0).toUpperCase() + n.slice(1)), ...FALLBACK_SKILLS])];
          setAllSkills(combined.sort((a, b) => a.localeCompare(b)));
        }
      })
      .catch(() => {})
      .finally(() => setSkillsLoading(false));
  }, [skillModalVisible]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => await signOut() },
    ]);
  };

  const openEditProfile = () => {
    setEditFullName(metadata.full_name || user?.email?.split('@')[0] || '');
    setEditCollege(metadata.college || '');
    setEditBio(metadata.bio || '');
    setEditModalVisible(true);
  };

  const saveEditProfile = async () => {
    setEditSaving(true);
    const { error } = await updateProfile({
      full_name: editFullName.trim() || fullName,
      college: editCollege.trim() || college,
      bio: editBio.trim(),
    });
    setEditSaving(false);
    if (error) Alert.alert('Error', error.message);
    else setEditModalVisible(false);
  };

  const openAddSkill = () => {
    setSkillSearch('');
    setSkillModalVisible(true);
  };

  const addSkill = async (skillName) => {
    const trimmed = (skillName || skillSearch).trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      Alert.alert('Already added', 'This skill is already in your list.');
      return;
    }
    setSkillSaving(true);
    const newSkills = [...skills, trimmed];
    const { error } = await updateProfile({ skills: newSkills });
    setSkillSaving(false);
    if (error) Alert.alert('Error', error.message);
    else setSkillModalVisible(false);
  };

  const removeSkill = async (skillToRemove) => {
    const newSkills = skills.filter((s) => s !== skillToRemove);
    await updateProfile({ skills: newSkills });
  };

  const openSocialLinks = () => {
    setEditGithub(github);
    setEditLinkedin(linkedin);
    setEditPortfolio(portfolio);
    setSocialModalVisible(true);
  };

  const saveSocialLinks = async () => {
    setSocialSaving(true);
    const { error } = await updateProfile({
      social_links: {
        github: editGithub.trim(),
        linkedin: editLinkedin.trim(),
        portfolio: editPortfolio.trim(),
      },
    });
    setSocialSaving(false);
    if (error) Alert.alert('Error', error.message);
    else setSocialModalVisible(false);
  };

  const openUrl = (url) => {
    if (!url || !url.startsWith('http')) {
      Alert.alert('No link', 'Add a link in Social Links first.');
      return;
    }
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open link.'));
  };

  const handleSettings = () => Alert.alert('Settings', 'App settings will be available here.', [{ text: 'OK' }]);
  const handleHelp = () => Alert.alert('Help & Support', 'Need help? Contact support@prolaunchhub.com', [{ text: 'OK' }]);

  const filteredSkills = skillSearch.trim()
    ? allSkills.filter((s) => s.toLowerCase().includes(skillSearch.toLowerCase()))
    : allSkills;

  const achievements = [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.bio}>{user?.email || ''}</Text>
            {bio ? <Text style={styles.bioLine}>{bio}</Text> : null}
            <Text style={styles.college}>{college}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={openEditProfile}>
          <Ionicons name="create-outline" size={20} color="#007AFF" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={styles.statIcon}><Ionicons name="flame" size={24} color="#FF6B35" /></View>
          <Text style={styles.statNumber}>{stats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.statIcon}><Ionicons name="folder" size={24} color="#007AFF" /></View>
          <Text style={styles.statNumber}>{stats.projects}</Text>
          <Text style={styles.statLabel}>Projects</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.statIcon}><Ionicons name="trophy" size={24} color="#FFD700" /></View>
          <Text style={styles.statNumber}>{stats.hackathons}</Text>
          <Text style={styles.statLabel}>Hackathons</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.statIcon}><Ionicons name="document-text" size={24} color="#4CAF50" /></View>
          <Text style={styles.statNumber}>{stats.posts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.skillsContainer}>
          {skills.length === 0 ? (
            <Text style={styles.emptySectionText}>No skills added yet. Tap Add Skill to choose from a list.</Text>
          ) : (
            skills.map((skill, index) => (
              <TouchableOpacity
                key={index}
                style={styles.skillTag}
                onLongPress={() => Alert.alert('Remove skill', `Remove "${skill}"?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Remove', style: 'destructive', onPress: () => removeSkill(skill) },
                ])}
              >
                <Text style={styles.skillText}>{skill}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openAddSkill}>
          <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
          <Text style={styles.addButtonText}>Add Skill</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Social Links</Text>
        <TouchableOpacity style={styles.linkItem} onPress={() => (github ? openUrl(github) : openSocialLinks())}>
          <Ionicons name="logo-github" size={24} color="#333" />
          <Text style={styles.linkText}>{github || 'Add GitHub URL'}</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem} onPress={() => (linkedin ? openUrl(linkedin) : openSocialLinks())}>
          <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
          <Text style={styles.linkText}>{linkedin || 'Add LinkedIn URL'}</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem} onPress={() => (portfolio ? openUrl(portfolio) : openSocialLinks())}>
          <Ionicons name="globe-outline" size={24} color="#333" />
          <Text style={styles.linkText}>{portfolio || 'Add Portfolio URL'}</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editLinksButton} onPress={openSocialLinks}>
          <Text style={styles.editLinksButtonText}>Edit social links</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {achievements.length === 0 ? (
          <Text style={styles.emptySectionText}>No achievements yet. Keep building!</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {achievements.map((a) => (
              <View key={a.id} style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>{a.icon}</Text>
                <Text style={styles.achievementTitle}>{a.title}</Text>
                <Text style={styles.achievementDate}>{a.date}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
          <Ionicons name="settings-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleHelp}>
          <Ionicons name="help-circle-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Full name" placeholderTextColor="#999" value={editFullName} onChangeText={setEditFullName} />
            <TextInput style={styles.input} placeholder="College" placeholderTextColor="#999" value={editCollege} onChangeText={setEditCollege} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Short bio (optional)" placeholderTextColor="#999" value={editBio} onChangeText={setEditBio} multiline />
            <TouchableOpacity style={styles.saveButton} onPress={saveEditProfile} disabled={editSaving}>
              {editSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save</Text>}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add Skill Modal */}
      <Modal visible={skillModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.skillModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Skill</Text>
              <TouchableOpacity onPress={() => setSkillModalVisible(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.skillHint}>Skills are loaded from the web. Search and tap to add.</Text>
            <TextInput
              style={styles.input}
              placeholder="Search skills..."
              placeholderTextColor="#999"
              value={skillSearch}
              onChangeText={setSkillSearch}
            />
            {skillsLoading ? (
              <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />
            ) : (
              <FlatList
                data={filteredSkills.slice(0, 80)}
                keyExtractor={(item) => item}
                style={styles.skillList}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.skillListItem} onPress={() => addSkill(item)} disabled={skillSaving}>
                    <Text style={styles.skillListItemText}>{item}</Text>
                    {skills.includes(item) ? <Ionicons name="checkmark-circle" size={20} color="#4CAF50" /> : <Ionicons name="add-circle-outline" size={20} color="#007AFF" />}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Social Links Modal */}
      <Modal visible={socialModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Social Links</Text>
              <TouchableOpacity onPress={() => setSocialModalVisible(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>GitHub profile URL</Text>
            <TextInput style={styles.input} placeholder="https://github.com/username" placeholderTextColor="#999" value={editGithub} onChangeText={setEditGithub} keyboardType="url" autoCapitalize="none" />
            <Text style={styles.inputLabel}>LinkedIn profile URL</Text>
            <TextInput style={styles.input} placeholder="https://linkedin.com/in/username" placeholderTextColor="#999" value={editLinkedin} onChangeText={setEditLinkedin} keyboardType="url" autoCapitalize="none" />
            <Text style={styles.inputLabel}>Portfolio / website URL</Text>
            <TextInput style={styles.input} placeholder="https://yourportfolio.com" placeholderTextColor="#999" value={editPortfolio} onChangeText={setEditPortfolio} keyboardType="url" autoCapitalize="none" />
            <TouchableOpacity style={styles.saveButton} onPress={saveSocialLinks} disabled={socialSaving}>
              {socialSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save links</Text>}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#fff', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  profileHeader: { flexDirection: 'row', marginBottom: 15 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  profileInfo: { flex: 1 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  bio: { fontSize: 14, color: '#666', marginBottom: 2 },
  bioLine: { fontSize: 14, color: '#666', marginBottom: 2 },
  college: { fontSize: 14, color: '#999' },
  editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderWidth: 1, borderColor: '#007AFF', borderRadius: 8 },
  editButtonText: { color: '#007AFF', marginLeft: 5, fontWeight: 'bold' },
  statsContainer: { flexDirection: 'row', backgroundColor: '#fff', padding: 20, justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  statItem: { alignItems: 'center' },
  statIcon: { marginBottom: 5 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 5 },
  section: { backgroundColor: '#fff', padding: 20, marginTop: 10, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  skillTag: { backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  skillText: { fontSize: 14, color: '#333' },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderWidth: 1, borderColor: '#007AFF', borderRadius: 8, borderStyle: 'dashed' },
  addButtonText: { color: '#007AFF', marginLeft: 5, fontWeight: '600' },
  linkItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  linkText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#333' },
  editLinksButton: { marginTop: 12, paddingVertical: 8 },
  editLinksButtonText: { color: '#007AFF', fontSize: 14, fontWeight: '600' },
  achievementCard: { width: 120, backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginRight: 10, alignItems: 'center' },
  achievementIcon: { fontSize: 40, marginBottom: 10 },
  achievementTitle: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  achievementDate: { fontSize: 12, color: '#666' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16 },
  logoutText: { color: '#FF3B30' },
  emptySectionText: { fontSize: 14, color: '#999', marginBottom: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  inputLabel: { fontSize: 14, color: '#666', marginBottom: 6 },
  saveButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  skillHint: { fontSize: 12, color: '#666', marginBottom: 10 },
  skillModalContent: { maxHeight: '80%' },
  skillList: { maxHeight: 320 },
  skillListItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  skillListItemText: { fontSize: 16, color: '#333' },
});

export default ProfileScreen;
