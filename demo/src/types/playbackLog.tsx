export interface PlaybackLog {
    logId?: string; 
    bookId: string; 
    userId: string; 
    playTimestamp: string; // When the playback started
    duration?: number; // Duration of the playback in seconds
  }
  
