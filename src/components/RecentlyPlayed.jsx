// src/components/home/RecentlyPlayed.jsx
import MediaCard from './MediaCard.jsx';

const RecentlyPlayed = () => {
  // Mock data (will be replaced with API data later)
  const recentlyPlayed = [
    { id: 1, title: 'Today\'s Top Hits', subtitle: 'The Weekend, Dua Lipa, Benson Boone', image: 'https://source.unsplash.com/random/300x300?pop', type: 'playlist' },
    { id: 2, title: 'Rap Caviar', subtitle: 'Drake, Kendrick Lamar, J. Cole', image: 'https://source.unsplash.com/random/300x300?rap', type: 'playlist' },
    { id: 3, title: 'All Out 2010s', subtitle: 'The biggest songs of the 2010s', image: 'https://source.unsplash.com/random/300x300?2010s', type: 'playlist' },
    { id: 4, title: 'Rock Classics', subtitle: 'Queen, AC/DC, The Rolling Stones', image: 'https://source.unsplash.com/random/300x300?classicrock', type: 'playlist' },
    { id: 5, title: 'Chill Hits', subtitle: 'Kick back to the best new and recent chill hits', image: 'https://source.unsplash.com/random/300x300?chill', type: 'playlist' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {recentlyPlayed.map(item => (
        <MediaCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default RecentlyPlayed;