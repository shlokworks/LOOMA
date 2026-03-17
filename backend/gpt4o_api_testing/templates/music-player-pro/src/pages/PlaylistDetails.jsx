import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMusicStore } from "../store/useMusicStore";
import SongCard from "../components/SongCard";

const PlaylistDetails = () => {
  const { id } = useParams();
  const { playlists, songs, artists, loadAll, playSong } = useMusicStore();

  useEffect(() => {
    loadAll();
  }, []);

  const playlist = playlists.find((p) => p.id === id);
  if (!playlist) return <p>Loading...</p>;

  // Get all songs in this playlist
  const playlistSongs = songs.filter((song) => 
    playlist.songIds.includes(song.id)
  );

  // Calculate total duration
  const totalDuration = playlistSongs.reduce((total, song) => total + song.duration, 0);
  
  // Format duration to MM:SS
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Play all songs in playlist
  const handlePlayPlaylist = () => {
    if (playlistSongs.length > 0) {
      // Play the first song in the playlist
      playSong(playlistSongs[0].id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Playlist Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <img 
          src={playlist.image} 
          alt={playlist.name}
          className="w-48 h-48 md:w-60 md:h-60 object-cover rounded-lg shadow-lg"
        />
        
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-2">PLAYLIST</p>
          <h1 className="text-4xl font-bold mb-4">{playlist.name}</h1>
          
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <span>{playlistSongs.length} songs</span>
            <span>•</span>
            <span>{formatDuration(totalDuration)}</span>
          </div>
          
          <button
            onClick={handlePlayPlaylist}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play All
          </button>
        </div>
      </div>

      {/* Songs List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Songs in this playlist</h2>
          {playlistSongs.length === 0 && (
            <p className="text-gray-500 mt-2">No songs in this playlist yet.</p>
          )}
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {playlistSongs.map((song, index) => {
            const artist = artists.find((a) => a.id === song.artistId);
            return (
              <div key={song.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 w-6 text-center">{index + 1}</span>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{song.title}</h3>
                      <p className="text-sm text-gray-500 truncate">
                        {artist?.name || "Unknown Artist"}
                        {song.albumId && ` • Album ${song.albumId}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="text-gray-500">
                      {formatDuration(song.duration)}
                    </span>
                    
                    <button
                      onClick={() => playSong(song.id)}
                      className="p-2 text-gray-500 hover:text-green-500 transition-colors"
                      title="Play this song"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => {/* Add to favorites logic here */}}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      title="Add to favorites"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* You could also show SongCard components in grid view like other pages */}
      {/* Uncomment this section if you prefer the card view */}
      {/*
      <h2 className="text-xl font-semibold mt-8 mb-4">All Songs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlistSongs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
      */}
    </div>
  );
};

export default PlaylistDetails;