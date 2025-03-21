import MediaCard from './MediaCard.jsx';

const MadeForYou = () => {
  // Mock data (will be replaced with API data later)
  const recommendations = [
    { id: 1, title: 'Daily Mix 1', subtitle: 'Coldplay, The Weeknd, Dua Lipa and more', image: 'https://source.unsplash.com/random/300x300?mix1', type: 'playlist' },
    { id: 2, title: 'Daily Mix 2', subtitle: 'Post Malone, Khalid, Lauv and more', image: 'https://source.unsplash.com/random/300x300?mix2', type: 'playlist' },
    { id: 3, title: 'Discover Weekly', subtitle: 'Your weekly mixtape of fresh music', image: 'https://source.unsplash.com/random/300x300?discover', type: 'playlist' },
    { id: 4, title: 'Release Radar', subtitle: 'Catch all the latest music from artists you follow', image: 'https://source.unsplash.com/random/300x300?release', type: 'playlist' },
    { id: 5, title: 'On Repeat', subtitle: 'Songs you love right now', image: 'https://source.unsplash.com/random/300x300?repeat', type: 'playlist' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {recommendations.map(item => (
        <MediaCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default MadeForYou;