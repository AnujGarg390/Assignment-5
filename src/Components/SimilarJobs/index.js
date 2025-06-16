import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {Link} from 'react-router-dom'
import './index.css'

const SimilarJobs = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
    id,
  } = similarJobDetails
  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="job-item similar-job-item">
        <div className="logo-title-location-container">
          <div className="logo-title-container">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="similar job company logo"
            />
            <div className="title-rating-container">
              <h1 className="title">{title}</h1>
              <div className="rating-container">
                <BsStarFill className="rating-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <h1 className="description-heading">Description</h1>
          <p className="similar-description-text">{jobDescription}</p>
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
        </div>
      </li>
    </Link>
  )
}

export default SimilarJobs
