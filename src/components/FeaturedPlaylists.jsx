import { Link } from 'react-router-dom';

const FeaturedPlaylists = () => {
  const featuredItems = [
    { id: 1, title: 'Liked Songs', image: 'https://source.unsplash.com/random/200x200?music', color: 'from-indigo-800' },
    { id: 2, title: 'Daily Mix 1', image: 'https://source.unsplash.com/random/200x200?album', color: 'from-pink-800' },
    { id: 3, title: 'Discover Weekly', image: 'https://source.unsplash.com/random/200x200?concert', color: 'from-green-800' },
    { id: 4, title: 'Release Radar', image: 'https://source.unsplash.com/random/200x200?band', color: 'from-red-800' },
    { id: 5, title: 'Rock Classics', image: 'https://source.unsplash.com/random/200x200?rock', color: 'from-yellow-800' },
    { id: 6, title: 'Chill Hits', image: 'https://source.unsplash.com/random/200x200?chill', color: 'from-blue-800' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {featuredItems.map(item => (
        <Link 
          key={item.id}
          to={`/playlist/${item.id}`}
          className={`flex items-center bg-gradient-to-r ${item.color} to-zinc-800 hover:bg-zinc-700 transition rounded-md overflow-hidden h-20`}
        >
          <img src={item.image} alt={item.title} className="h-20 w-20 shadow-lg" />
          <span className="font-bold px-4">{item.title}</span>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedPlaylists;