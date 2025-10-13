import "./ListProfileCard.css";
import "../../components/SpecialHead/SpecialHead.css";
import "../../components/Toolbar/Toolbar.css";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import SpecialHead from "../../components/SpecialHead/SpecialHead";
import Toolbar from "../../components/Toolbar/Toolbar";
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import FallBack from "../../components/FallBack/FallBack";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../../features/profiles/profileSlice";

function ListProfileCard() {
  const dispatch = useDispatch();
  const { profiles, loading } = useSelector((state) => state.profiles);
  const { currentUser } = useSelector((state) => state.auth);

  const [visibleCount, setVisibleCount] = useState(3);

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

  const currentProfiles = useMemo(
    () => orderedProfiles.slice(0, visibleCount),
    [orderedProfiles, visibleCount]
  );

  const handleFilter = useCallback(
    (value) => {
      setVisibleCount(3);
      const name = value?.trim();
      if (name && name.length > 0) {
        dispatch(fetchProfiles({ name }));
      } else {
        dispatch(fetchProfiles());
      }
    },
    [dispatch]
  );

  return (
    <section id="ListProfileCard">
      <div className="container">
        <div className="Adjusted-Title">
          <SpecialHead Heading="Profiles" />
        </div>

        <Toolbar
          ArrayName="Profiles"
          Array={orderedProfiles}
          onFilter={handleFilter}
        />

        {loading ? (
          <FallBack message="Loading profiles..." />
        ) : (
          <>
            <div className="row">
              {orderedProfiles.length > 0 ? (
                currentProfiles.map((profile) => (
                  <ProfileCard key={profile.id} id={profile.id} />
                ))
              ) : (
                <FallBack message="No profiles found." />
              )}
            </div>

            {visibleCount < orderedProfiles.length && (
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
