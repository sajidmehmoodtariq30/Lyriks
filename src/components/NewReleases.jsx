import MediaCard from './MediaCard.jsx';

const NewReleases = () => {
  const newReleases = [
    { id: 1, title: 'After Hours', subtitle: 'The Weeknd', image: 'https://source.unsplash.com/random/300x300?album1', type: 'album' },
    { id: 2, title: 'Future Nostalgia', subtitle: 'Dua Lipa', image: 'https://source.unsplash.com/random/300x300?album2', type: 'album' },
    { id: 3, title: 'DONDA', subtitle: 'Kanye West', image: 'https://source.unsplash.com/random/300x300?album3', type: 'album' },
    { id: 4, title: 'SOUR', subtitle: 'Olivia Rodrigo', image: 'https://source.unsplash.com/random/300x300?album4', type: 'album' },
    { id: 5, title: 'Planet Her', subtitle: 'Doja Cat', image: 'https://source.unsplash.com/random/300x300?album5', type: 'album' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {newReleases.map(item => (
        <MediaCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default NewReleases;