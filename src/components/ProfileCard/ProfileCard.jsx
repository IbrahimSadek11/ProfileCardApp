import './ProfileCard.css'

function ProfileCard(props){
    return(
        <div id="ProfileCard">
            <div className="imageSection">
                <img src={props.img} alt="profile image" className="StyledImage" loading="lazy"/>
                <h2>{props.name}</h2>
            </div>
            <div className="Description">    
                <h3>Job: {props.job}</h3>
                <p>{props.phone}</p>
                <p>{props.email}</p>
            </div>
        </div>
    )
}

export default ProfileCard;
