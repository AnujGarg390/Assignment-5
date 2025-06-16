import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import {MdLocationOn} from 'react-icons/md'
import Header from '../Header'
import SkillsCard from '../SkillsCard'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiCardStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobCardDetails extends Component {
  state = {
    apiCardStatus: apiCardStatusConstant.initial,
    jobData: {},
    similarJobData: [],
  }

  componentDidMount() {
    this.getCardDetails()
  }

  componentDidUpdate(prevProps) {
    const prevId = prevProps.match.params.id
    const {match} = this.props
    const {params} = match
    const {id} = params
    const currentId = id
    if (prevId !== currentId) {
      this.getCardDetails()
    }
  }

  getSimilarFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    id: data.id,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getFormatted = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    id: data.id,
    title: data.title,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    rating: data.rating,
    packagePerAnnum: data.package_per_annum,
    skills: data.skills.map(eachSkills => ({
      imageUrl: eachSkills.image_url,
      name: eachSkills.name,
    })),
  })

  getCardDetails = async () => {
    this.setState({apiCardStatus: apiCardStatusConstant.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const fetchedCardResponse = await fetch(apiUrl, options)
    if (fetchedCardResponse.ok === true) {
      const responseData = await fetchedCardResponse.json()
      const updatedData = this.getFormatted(responseData.job_details)
      const updatedSimilarJobData = responseData.similar_jobs.map(
        eachSimilarJob => this.getSimilarFormattedData(eachSimilarJob),
      )
      this.setState({
        jobData: updatedData,
        similarJobData: updatedSimilarJobData,
        apiCardStatus: apiCardStatusConstant.success,
      })
    } else {
      this.setState({apiCardStatus: apiCardStatusConstant.failure})
    }
  }

  renderSuccessView = () => {
    const {jobData, similarJobData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      jobDescription,
      employmentType,
      location,
      rating,
      lifeAtCompany,
      packagePerAnnum,
      skills,
      title,
    } = jobData
    const {imageUrl, description} = lifeAtCompany
    return (
      <div className="job-details-view-container">
        <div className="job-item job-item-details">
          <div className="logo-title-location-container">
            <div className="logo-title-container">
              <img
                src={companyLogoUrl}
                className="company-logo"
                alt="job details company logo"
              />
              <div className="title-rating-container">
                <h1 className="title">{title}</h1>
                <div className="rating-container">
                  <BsStarFill className="rating-icon" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package-container">
              <div className="location-employee-container">
                <div className="location-container">
                  <MdLocationOn className="icon" />
                  <p className="location">{location}</p>
                </div>
                <div className="employee-type-container">
                  <BsFillBriefcaseFill className="icon" />
                  <p className="employee-type-heading">{employmentType}</p>
                </div>
              </div>
              <p className="package">{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="line" />
          <div className="description-visit-container">
            <h1 className="description-heading">Description</h1>
            <div className="visit-container">
              <a className="visit" href={companyWebsiteUrl}>
                Visit
              </a>
              <BiLinkExternal className="visit-icon" />
            </div>
          </div>
          <p className="description-text">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list-container">
            {skills.map(eachSkill => (
              <SkillsCard skillDetails={eachSkill} key={eachSkill.name} />
            ))}
          </ul>
          <h1 className="life-at-company-heading">Life At Company</h1>
          <div className="life-at-company-container">
            <p className="life-at-company-text">{description}</p>
            <img
              className="life-at-company-image"
              alt="life at company"
              src={imageUrl}
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobData.map(eachSimilarJob => (
            <SimilarJobs
              key={eachSimilarJob.id}
              similarJobDetails={eachSimilarJob}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-img-button-container">
      <img
        className="job-item-failure-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <div className="job-failure-button-container">
        <button
          type="button"
          className="failure-button"
          onClick={this.getCardDetails}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiCardStatus} = this.state
    switch (apiCardStatus) {
      case apiCardStatusConstant.success:
        return this.renderSuccessView()
      case apiCardStatusConstant.failure:
        return this.renderFailureView()
      case apiCardStatusConstant.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}

export default JobCardDetails
