import { FiPlay } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const MediaCard = ({ id, title, subtitle, image, type }) => {
    return (
        <div className="bg-zinc-800 p-4 rounded-md hover:bg-zinc-700 transition group">
            <Link to={`/${type}/${id}`} className="block relative">
                <div className="relative mb-4">
                    <img
                        src={image}
                        alt={title}
                        className={`w-full shadow-lg object-cover ${type === 'artist' ? 'rounded-full' : 'rounded'}`}
                    />
                    <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition">
                        <FiPlay className="text-black" size={20} />
                    </button>
                </div>
                <h3 className="font-bold truncate">{title}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{subtitle}</p>
            </Link>
        </div>
    );
};

export default MediaCard;