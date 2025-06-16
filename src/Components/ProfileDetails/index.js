import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiProfileStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProfileDetails extends Component {
  state = {
    apiProfileStatus: apiProfileStatusConstants.initial,
    profileData: [],
  }

  componentDidMount() {
    this.onGetProfileDetails()
  }

  onGetProfileDetails = async () => {
    this.setState({
      apiProfileStatus: apiProfileStatusConstants.inProgress,
    })
    const apiUrl = `https://apis.ccbp.in/profile`
    const token = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const profileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        apiProfileStatus: apiProfileStatusConstants.success,
        profileData,
      })
    } else {
      this.setState({apiProfileStatus: apiProfileStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-success-container">
        <img className="profile-img" src={profileImageUrl} alt="profile" />
        <h1 className="profile-heading">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="profile-error-view-container">
      <button
        type="button"
        className="profile-failure-btn"
        id="button"
        onClick={this.onGetProfileDetails}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiProfileStatus} = this.state
    switch (apiProfileStatus) {
      case apiProfileStatusConstants.success:
        return this.renderSuccessView()
      case apiProfileStatusConstants.failure:
        return this.renderFailureView()
      case apiProfileStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }
}

export default ProfileDetails
