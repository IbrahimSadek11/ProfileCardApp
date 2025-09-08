import './ListProfileCard.css';
import "../../components/SpecialHead/SpecialHead.css"
import "../../components/Toolbar/Toolbar.css"
import "../../components/Pagination/Pagination.css"
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import Profiles from '../../data/Profile';
import SpecialHead from '../../components/SpecialHead/SpecialHead';
import Toolbar from '../../components/Toolbar/Toolbar';
import Pagination from '../../components/Pagination/Pagination';
import { useState } from 'react';

function ListProfileCard() {
  const [filtered, setFiltered] = useState(Profiles);
  function filterData (value) {
        // console.log("value",value)
        setFiltered(Profiles?.filter(item =>
            item?.name?.toLowerCase()?.includes(value.toLowerCase())
        ))
    }
    
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 3;

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filtered.slice(indexOfFirstProfile, indexOfLastProfile);

  const totalPages = Math.ceil(filtered.length / profilesPerPage);

  return (
    <section id="ListProfileCard">
      <div className="container">
        <SpecialHead Heading ="Profiles"/>
        <Toolbar ArrayName = "Profiles" Array = {filtered} onFilter={filterData} />
        <div className="row">
          {currentProfiles.map((profile, index) => (
            <ProfileCard
              key={index}
              name={profile.name}
              job={profile.job}
              img={profile.image}
              phone={profile.phone}
              email={profile.email}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          onNext={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        />

      </div>
    </section>
  );
}

export default ListProfileCard;
