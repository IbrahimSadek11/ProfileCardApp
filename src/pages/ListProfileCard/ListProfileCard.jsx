import './ListProfileCard.css';
import "../../components/SpecialHead/SpecialHead.css"
import "../../components/Toolbar/Toolbar.css"
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import Profiles from '../../data/Profile';
import SpecialHead from '../../components/SpecialHead/SpecialHead';
import Toolbar from '../../components/Toolbar/Toolbar';
import { useState } from 'react';
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import FallBack from '../../components/FallBack/FallBack';

function ListProfileCard() {
  const [filtered, setFiltered] = useState(Profiles);
  const [visibleCount, setVisibleCount] = useState(3);

  function filterData(value) {
    setFiltered(
      Profiles?.filter(item =>
        item?.name?.toLowerCase()?.includes(value.toLowerCase())
      )
    );
    setVisibleCount(3);
  }

  const currentProfiles = filtered.slice(0, visibleCount);

  return (
    <section id="ListProfileCard">
      <div className="container">
        <SpecialHead Heading="Profiles" />
        <Toolbar ArrayName="Profiles" Array={filtered} onFilter={filterData} />

        <div className="row">
          {filtered.length > 0 ? (
            currentProfiles.map((profile, index) => (
              <ProfileCard
                key={index}
                name={profile.name}
                job={profile.job}
                img={profile.image}
                phone={profile.phone}
                email={profile.email}
              />
            ))
          ) : (
            <FallBack message="Profile Not Found."/>
          )}
        </div>

        {filtered.length > 0 && visibleCount < filtered.length && (
          <LoadMoreButton
            onClick={() => setVisibleCount(prev => prev + 3)}
            message = "Load More Profiles"
          />
        )}
      </div>
    </section>
  );
}

export default ListProfileCard;
