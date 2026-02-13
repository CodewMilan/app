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
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../contexts/AuthContext';
import theme from '../theme';

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
          <Feather name="edit-2" size={20} color={theme.primary} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={styles.statIcon}><Feather name="zap" size={24} color={theme.warning} /></View>
          <Text style={styles.statNumber}>{stats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.statIcon}><Feather name="folder" size={24} color={theme.primary} /></View>
          <Text style={styles.statNumber}>{stats.projects}</Text>
          <Text style={styles.statLabel}>Projects</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.statIcon}><Feather name="award" size={24} color={theme.primary} /></View>
          <Text style={styles.statNumber}>{stats.hackathons}</Text>
          <Text style={styles.statLabel}>Hackathons</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.statIcon}><Feather name="file-text" size={24} color={theme.secondary} /></View>
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
          <Feather name="plus-circle" size={20} color={theme.primary} />
          <Text style={styles.addButtonText}>Add Skill</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Social Links</Text>
        <TouchableOpacity style={styles.linkItem} onPress={() => (github ? openUrl(github) : openSocialLinks())}>
          <Feather name="github" size={24} color={theme.text} />
          <Text style={styles.linkText}>{github || 'Add GitHub URL'}</Text>
          <Feather name="chevron-right" size={20} color={theme.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem} onPress={() => (linkedin ? openUrl(linkedin) : openSocialLinks())}>
          <Feather name="linkedin" size={24} color={theme.info} />
          <Text style={styles.linkText}>{linkedin || 'Add LinkedIn URL'}</Text>
          <Feather name="chevron-right" size={20} color={theme.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem} onPress={() => (portfolio ? openUrl(portfolio) : openSocialLinks())}>
          <Feather name="globe" size={24} color={theme.text} />
          <Text style={styles.linkText}>{portfolio || 'Add Portfolio URL'}</Text>
          <Feather name="chevron-right" size={20} color={theme.textMuted} />
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
          <Feather name="settings" size={24} color={theme.textSecondary} />
          <Text style={styles.menuText}>Settings</Text>
          <Feather name="chevron-right" size={20} color={theme.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleHelp}>
          <Feather name="help-circle" size={24} color={theme.textSecondary} />
          <Text style={styles.menuText}>Help & Support</Text>
          <Feather name="chevron-right" size={20} color={theme.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Feather name="log-out" size={24} color={theme.error} />
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
                <Feather name="x" size={28} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={theme.textMuted} value={editFullName} onChangeText={setEditFullName} />
            <TextInput style={styles.input} placeholder="College" placeholderTextColor={theme.textMuted} value={editCollege} onChangeText={setEditCollege} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Short bio (optional)" placeholderTextColor={theme.textMuted} value={editBio} onChangeText={setEditBio} multiline />
            <TouchableOpacity style={styles.saveButton} onPress={saveEditProfile} disabled={editSaving}>
              {editSaving ? <ActivityIndicator color={theme.textOnPrimary} /> : <Text style={styles.saveButtonText}>Save</Text>}
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
                <Feather name="x" size={28} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.skillHint}>Skills are loaded from the web. Search and tap to add.</Text>
            <TextInput
              style={styles.input}
              placeholder="Search skills..."
              placeholderTextColor={theme.textMuted}
              value={skillSearch}
              onChangeText={setSkillSearch}
            />
            {skillsLoading ? (
              <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 20 }} />
            ) : (
              <FlatList
                data={filteredSkills.slice(0, 80)}
                keyExtractor={(item) => item}
                style={styles.skillList}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.skillListItem} onPress={() => addSkill(item)} disabled={skillSaving}>
                    <Text style={styles.skillListItemText}>{item}</Text>
                    {skills.includes(item) ? <Feather name="check-circle" size={20} color={theme.secondary} /> : <Feather name="plus-circle" size={20} color={theme.primary} />}
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
                <Feather name="x" size={28} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>GitHub profile URL</Text>
            <TextInput style={styles.input} placeholder="https://github.com/username" placeholderTextColor={theme.textMuted} value={editGithub} onChangeText={setEditGithub} keyboardType="url" autoCapitalize="none" />
            <Text style={styles.inputLabel}>LinkedIn profile URL</Text>
            <TextInput style={styles.input} placeholder="https://linkedin.com/in/username" placeholderTextColor={theme.textMuted} value={editLinkedin} onChangeText={setEditLinkedin} keyboardType="url" autoCapitalize="none" />
            <Text style={styles.inputLabel}>Portfolio / website URL</Text>
            <TextInput style={styles.input} placeholder="https://yourportfolio.com" placeholderTextColor={theme.textMuted} value={editPortfolio} onChangeText={setEditPortfolio} keyboardType="url" autoCapitalize="none" />
            <TouchableOpacity style={styles.saveButton} onPress={saveSocialLinks} disabled={socialSaving}>
              {socialSaving ? <ActivityIndicator color={theme.textOnPrimary} /> : <Text style={styles.saveButtonText}>Save links</Text>}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { backgroundColor: theme.surface, padding: 20, borderBottomWidth: 1, borderBottomColor: theme.border },
  profileHeader: { flexDirection: 'row', marginBottom: 15 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: theme.textOnPrimary, fontSize: 32, fontFamily: theme.fontFamilyBold },
  profileInfo: { flex: 1 },
  name: { fontSize: 24, fontFamily: theme.fontFamilyBold, marginBottom: 5, color: theme.text },
  bio: { fontSize: 14, fontFamily: theme.fontFamily, color: theme.textSecondary, marginBottom: 2 },
  bioLine: { fontSize: 14, fontFamily: theme.fontFamily, color: theme.textSecondary, marginBottom: 2 },
  college: { fontSize: 14, fontFamily: theme.fontFamily, color: theme.textMuted },
  editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderWidth: 1, borderColor: theme.primary, borderRadius: theme.radiusSm },
  editButtonText: { color: theme.primary, marginLeft: 5, fontFamily: theme.fontFamilySemiBold },
  statsContainer: { flexDirection: 'row', backgroundColor: theme.surface, padding: 20, justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: theme.border },
  statItem: { alignItems: 'center' },
  statIcon: { marginBottom: 5 },
  statNumber: { fontSize: 20, fontFamily: theme.fontFamilyBold, color: theme.text },
  statLabel: { fontSize: 12, fontFamily: theme.fontFamily, color: theme.textSecondary, marginTop: 5 },
  section: { backgroundColor: theme.surface, padding: 20, marginTop: 10, borderTopWidth: 1, borderTopColor: theme.border },
  sectionTitle: { fontSize: 18, fontFamily: theme.fontFamilySemiBold, marginBottom: 15, color: theme.text },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  skillTag: { backgroundColor: theme.inputBg, paddingHorizontal: 12, paddingVertical: 8, borderRadius: theme.radiusLg, marginRight: 8, marginBottom: 8 },
  skillText: { fontSize: 14, fontFamily: theme.fontFamily, color: theme.text },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderWidth: 1, borderColor: theme.primary, borderRadius: theme.radiusSm, borderStyle: 'dashed' },
  addButtonText: { color: theme.primary, marginLeft: 5, fontFamily: theme.fontFamilySemiBold },
  linkItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: theme.border },
  linkText: { flex: 1, marginLeft: 15, fontSize: 16, fontFamily: theme.fontFamily, color: theme.text },
  editLinksButton: { marginTop: 12, paddingVertical: 8 },
  editLinksButtonText: { color: theme.primary, fontSize: 14, fontFamily: theme.fontFamilySemiBold },
  achievementCard: { width: 120, backgroundColor: theme.inputBg, padding: 15, borderRadius: theme.radiusSm, marginRight: 10, alignItems: 'center' },
  achievementIcon: { fontSize: 40, marginBottom: 10 },
  achievementTitle: { fontSize: 14, fontFamily: theme.fontFamilySemiBold, textAlign: 'center', marginBottom: 5, color: theme.text },
  achievementDate: { fontSize: 12, fontFamily: theme.fontFamily, color: theme.textSecondary },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: theme.border },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16, fontFamily: theme.fontFamily, color: theme.text },
  logoutText: { color: theme.error },
  emptySectionText: { fontSize: 14, fontFamily: theme.fontFamily, color: theme.textMuted, marginBottom: 10 },
  modalOverlay: { flex: 1, backgroundColor: theme.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.surface, borderTopLeftRadius: theme.radiusXl, borderTopRightRadius: theme.radiusXl, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontFamily: theme.fontFamilyBold, color: theme.text },
  input: { borderWidth: 1, borderColor: theme.border, borderRadius: theme.radius, padding: 14, fontSize: 16, fontFamily: theme.fontFamily, marginBottom: 12, color: theme.text, backgroundColor: theme.inputBg },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  inputLabel: { fontSize: 14, fontFamily: theme.fontFamily, color: theme.textSecondary, marginBottom: 6 },
  saveButton: { backgroundColor: theme.primary, padding: 16, borderRadius: theme.radius, alignItems: 'center' },
  saveButtonText: { color: theme.textOnPrimary, fontFamily: theme.fontFamilySemiBold, fontSize: 16 },
  skillHint: { fontSize: 12, fontFamily: theme.fontFamily, color: theme.textSecondary, marginBottom: 10 },
  skillModalContent: { maxHeight: '80%' },
  skillList: { maxHeight: 320 },
  skillListItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: theme.border },
  skillListItemText: { fontSize: 16, fontFamily: theme.fontFamily, color: theme.text },
});

export default ProfileScreen;
