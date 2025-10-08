import "./ListProfileCard.css";
import "../../components/SpecialHead/SpecialHead.css";
import "../../components/Toolbar/Toolbar.css";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import SpecialHead from "../../components/SpecialHead/SpecialHead";
import Toolbar from "../../components/Toolbar/Toolbar";
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import FallBack from "../../components/FallBack/FallBack";
import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../../features/profiles/profileSlice";

function ListProfileCard() {
  const dispatch = useDispatch();
  const { profiles, loading } = useSelector((state) => state.profiles);
  const { currentUser } = useSelector((state) => state.auth);

  const [visibleCount, setVisibleCount] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  const orderedProfiles = useMemo(() => {
    if (!currentUser) return profiles;

    const currentProfile = profiles.find(
      (p) => String(p.id) === String(currentUser.id)
    );
    const otherProfiles = profiles.filter(
      (p) => String(p.id) !== String(currentUser.id)
    );

    return currentProfile ? [currentProfile, ...otherProfiles] : profiles;
  }, [profiles, currentUser]);

  const filteredProfiles = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return orderedProfiles.filter((profile) =>
      profile?.name?.toLowerCase()?.includes(search)
    );
  }, [orderedProfiles, searchTerm]);

  const currentProfiles = filteredProfiles.slice(0, visibleCount);

  const handleFilter = (value) => {
    setSearchTerm(value);
    setVisibleCount(3);
  };

  return (
    <section id="ListProfileCard">
      <div className="container">
        <div className="Adjusted-Title">
          <SpecialHead Heading="Profiles" />
        </div>

        <Toolbar
          ArrayName="Profiles"
          Array={filteredProfiles}
          onFilter={handleFilter}
        />

        {loading ? (
          <FallBack message="Loading profiles..." />
        ) : (
          <>
            <div className="row">
              {filteredProfiles.length > 0 ? (
                currentProfiles.map((profile) => (
                  <ProfileCard key={profile.id} id={profile.id} />
                ))
              ) : (
                <FallBack message="No profiles found." />
              )}
            </div>

            {filteredProfiles.length > 0 &&
              visibleCount < filteredProfiles.length && (
                <LoadMoreButton
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                  message="Load More Profiles"
                />
              )}
          </>
        )}
      </div>
    </section>
  );
}

export default ListProfileCard;
