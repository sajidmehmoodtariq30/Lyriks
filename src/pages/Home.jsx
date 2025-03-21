import Layout from '../components/MainLayout';
import FeaturedPlaylists from '../components/FeaturedPlaylists';
import RecentlyPlayed from '../components/RecentlyPlayed';
import MadeForYou from '../components/MadeForYou';
import NewReleases from '../components/NewReleases';

const HomePage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Good afternoon</h1>

      <section className="mb-8">
        <FeaturedPlaylists />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recently played</h2>
        <RecentlyPlayed />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Made for you</h2>
        <MadeForYou />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">New releases</h2>
        <NewReleases />
      </section>
    </>
  );
};

export default HomePage;