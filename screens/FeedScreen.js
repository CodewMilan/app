import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../contexts/AuthContext';
import theme from '../theme';

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'you';

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleAddPost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now().toString(),
      username: displayName,
      content: newPost.trim(),
      likes: 0,
      comments: 0,
      time: 'now',
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleComment = (item) => {
    const preview = item.content.length > 30 ? item.content.slice(0, 30) + '...' : item.content;
    Alert.alert('Comments', `Comments for this post will appear here. (Post: "${preview}")`, [{ text: 'OK' }]);
  };

  const handleShare = (item) => {
    const preview = item.content.length > 40 ? item.content.slice(0, 40) + '...' : item.content;
    Alert.alert('Share', `Share "${preview}"`, [{ text: 'OK' }]);
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.username[0].toUpperCase()}</Text>
        </View>
        <View style={styles.postHeaderText}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <Feather name="heart" size={20} color={theme.textMuted} />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(item)}>
          <Feather name="message-circle" size={20} color={theme.textMuted} />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(item)}>
          <Feather name="share-2" size={20} color={theme.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.createPostContainer}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor={theme.textMuted}
          value={newPost}
          onChangeText={setNewPost}
          multiline
        />
        <TouchableOpacity style={styles.postButton} onPress={handleAddPost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="file-text" size={64} color={theme.textMuted} />
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>Share something with the community</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  createPostContainer: {
    backgroundColor: theme.surface,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.radiusSm,
    padding: 12,
    marginBottom: 10,
    minHeight: 50,
    fontFamily: theme.fontFamily,
    color: theme.text,
    backgroundColor: theme.inputBg,
  },
  postButton: {
    backgroundColor: theme.primary,
    padding: 12,
    borderRadius: theme.radiusSm,
    alignItems: 'center',
  },
  postButtonText: {
    color: theme.textOnPrimary,
    fontFamily: theme.fontFamilySemiBold,
  },
  listContainer: {
    padding: 10,
  },
  postContainer: {
    backgroundColor: theme.card,
    padding: 15,
    marginBottom: 10,
    borderRadius: theme.radiusSm,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: theme.textOnPrimary,
    fontFamily: theme.fontFamilySemiBold,
    fontSize: 16,
  },
  postHeaderText: {
    flex: 1,
  },
  username: {
    fontFamily: theme.fontFamilySemiBold,
    fontSize: 16,
    color: theme.text,
  },
  time: {
    fontFamily: theme.fontFamily,
    color: theme.textSecondary,
    fontSize: 12,
  },
  postContent: {
    fontSize: 15,
    fontFamily: theme.fontFamily,
    lineHeight: 22,
    marginBottom: 10,
    color: theme.text,
  },
  postActions: {
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    color: theme.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: theme.fontFamilySemiBold,
    color: theme.textSecondary,
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: theme.fontFamily,
    color: theme.textMuted,
    marginTop: 5,
  },
});

export default FeedScreen;




