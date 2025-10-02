import './ListProfileCard.css';
import "../../components/SpecialHead/SpecialHead.css";
import "../../components/Toolbar/Toolbar.css";

import ProfileCard from '../../components/ProfileCard/ProfileCard';
import SpecialHead from '../../components/SpecialHead/SpecialHead';
import Toolbar from '../../components/Toolbar/Toolbar';
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import FallBack from '../../components/FallBack/FallBack';

import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

function ListProfileCard() {
  const profiles = useSelector((state) => state.auth.profiles);
  const { currentUser } = useSelector((state) => state.auth);

  const [visibleCount, setVisibleCount] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");

  const orderedProfiles = useMemo(() => {
    if (!currentUser) return profiles;

    const currentProfile = profiles.find(p => String(p.id) === String(currentUser.id));
    const otherProfiles = profiles.filter(p => String(p.id) !== String(currentUser.id));

    return currentProfile ? [currentProfile, ...otherProfiles] : profiles;
  }, [profiles, currentUser]);

  const filtered = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return orderedProfiles.filter(item =>
      item?.name?.toLowerCase()?.includes(search)
    );
  }, [orderedProfiles, searchTerm]);

  const currentProfiles = filtered.slice(0, visibleCount);

  function filterData(value) {
    setSearchTerm(value);
    setVisibleCount(3);
  }

  return (
    <section id="ListProfileCard">
      <div className="container">
        <div className="Adjusted-Title">
          <SpecialHead Heading="Profiles"/>
        </div>
        <Toolbar ArrayName="Profiles" Array={filtered} onFilter={filterData} /> 

        <div className="row">
          {filtered.length > 0 ? (
            currentProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                id={profile.id}
              />
            ))
          ) : (
            <FallBack message="Profile Not Found." />
          )}
        </div>

        {filtered.length > 0 && visibleCount < filtered.length && (
          <LoadMoreButton
            onClick={() => setVisibleCount((prev) => prev + 3)}
            message="Load More Profiles"
          />
        )}
      </div>
    </section>
  );
}

export default ListProfileCard;
