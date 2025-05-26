import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import BeatLoader from 'react-spinners/BeatLoader'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const Profile = () => {
  const [profileData, setProfileData] = useState({})
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  useEffect(() => {
    getProfileData()
  }, [])

  const getProfileData = async () => {
    setApiStatus(apiStatusConstants.inProgress)

    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(profileApiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const profile = fetchedData.profile_details
      const updatedData = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      setProfileData(updatedData)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  const renderProfile = () => {
    const {profileImageUrl, name, shortBio} = profileData

    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="short-bio">{shortBio}</p>
      </div>
    )
  }

  const renderProfileFailureView = () => (
    <div className="profile-failure-view">
      <button type="button" className="retry-button" onClick={getProfileData}>
        Retry
      </button>
    </div>
  )

  const renderLoadingView = () => (
    <div className="profile-loader-container">
      <BeatLoader color="#ffffff" size="50px" />
    </div>
  )

  const renderProfileContent = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderProfile()
      case apiStatusConstants.failure:
        return renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return renderProfileContent()
}

export default Profile
