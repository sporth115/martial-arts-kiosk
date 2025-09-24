import { supabase } from '../lib/supabase';

// Storage bucket names
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
} as const;

// Avatar storage service
export const avatarStorage = {
  // Upload avatar image to Supabase storage
  async uploadAvatar(file: File, studentId: string): Promise<string> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${studentId}-${Date.now()}.${fileExt}`;
      const filePath = `student-avatars/${fileName}`;

      // Upload file to Supabase storage
      const { error } = await supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Replace existing file with same name
        });

      if (error) {
        console.error('Error uploading avatar:', error);
        throw new Error(`Failed to upload avatar: ${error.message}`);
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    }
  },

  // Upload avatar from blob URL
  async uploadAvatarFromBlob(blobUrl: string, studentId: string): Promise<string> {
    try {
      // Fetch the blob data
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      // Convert blob to File
      const file = new File([blob], `${studentId}-avatar.png`, { type: 'image/png' });

      // Upload the file
      return await this.uploadAvatar(file, studentId);
    } catch (error) {
      console.error('Error uploading avatar from blob:', error);
      throw error;
    }
  },

  // Delete avatar from storage
  async deleteAvatar(avatarUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(avatarUrl);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.indexOf(STORAGE_BUCKETS.AVATARS);
      
      if (bucketIndex === -1) {
        console.warn('Invalid avatar URL format:', avatarUrl);
        return;
      }

      const filePath = pathParts.slice(bucketIndex + 1).join('/');

      const { error } = await supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting avatar:', error);
        // Don't throw error for delete failures - just log them
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      // Don't throw error for delete failures - just log them
    }
  },

  // Check if URL is a Supabase storage URL
  isSupabaseStorageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('supabase') && urlObj.pathname.includes('storage');
    } catch {
      return false;
    }
  },
};

// Mock storage service for when Supabase is not configured
export const createMockAvatarStorage = () => ({
  uploadAvatar: () => Promise.reject(new Error('Supabase storage not configured')),
  uploadAvatarFromBlob: () => Promise.reject(new Error('Supabase storage not configured')),
  deleteAvatar: () => Promise.resolve(),
  isSupabaseStorageUrl: () => false,
});

// Export the appropriate storage service
export const storageService = avatarStorage;
