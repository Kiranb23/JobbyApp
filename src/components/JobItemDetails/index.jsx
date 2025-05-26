import {useEffect, useState} from 'react'
import {useParams} from 'react-router'
import Cookies from 'js-cookie'
import BeatLoader from 'react-spinners/BeatLoader'
import {BsBriefcaseFill, BsFillStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FiExternalLink} from 'react-icons/fi'

import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const getFormattedJobDetailsData = job => ({
  title: job.title,
  companyLogoUrl: job.company_logo_url,
  companyWebsiteUrl: job.company_website_url,
  employmentType: job.employment_type,
  jobDescription: job.job_description,
  id: job.id,
  location: job.location,
  packagePerAnnum: job.package_per_annum,
  rating: job.rating,
  lifeAtCompany: {
    description: job.life_at_company.description,
    imageUrl: job.life_at_company.image_url,
  },
  skills: job.skills.map(skill => ({
    name: skill.name,
    imageUrl: skill.image_url,
  })),
})

const getFormattedSimilarJobData = job => ({
  title: job.title,
  companyLogoUrl: job.company_logo_url,
  employmentType: job.employment_type,
  jobDescription: job.job_description,
  id: job.id,
  location: job.location,
  packagePerAnnum: job.package_per_annum,
  rating: job.rating,
})

const JobItemDetails = () => {
  const {id} = useParams()
  const [jobData, setJobData] = useState({})
  const [similarJobsData, setSimilarJobsData] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const getJobData = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobDetailsApiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = getFormattedJobDetailsData(fetchedData.job_details)
      const updatedSimilarJobsData = fetchedData.similar_jobs.map(job =>
        getFormattedSimilarJobData(job),
      )
      setJobData(updatedData)
      setSimilarJobsData(updatedSimilarJobsData)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getJobData()
  }, [id])

  const renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <BeatLoader color="#ffffff" size="50px" />
    </div>
  )

  const renderFailureView = () => (
    <div className="job-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-view-img"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={getJobData}>
        Retry
      </button>
    </div>
  )

  const renderSimilarJobList = () => (
    <>
      <h1 className="similar-jobs-heading">Similar Jobs</h1>
      <ul className="similar-jobs-list">
        {similarJobsData.map(each => (
          <SimilarJobItem key={each.id} jobDetails={each} />
        ))}
      </ul>
    </>
  )

  const renderJobItemDetails = () => {
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      lifeAtCompany,
      skills,
      companyWebsiteUrl,
    } = jobData
    const {description, imageUrl} = lifeAtCompany || {}

    return (
      <>
        <div className="job-details-container">
          <div className="job-intro-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div>
              <h1 className="title">{title}</h1>
              <div className="rating-container">
                <BsFillStarFill className="star" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-and-package-container">
            <div className="location-type-container">
              <div className="location-container">
                <MdLocationOn className="location-icon" />
                <p className="location">{location}</p>
              </div>
              <div className="employment-type-container">
                <BsBriefcaseFill className="employment-type-icon" />
                <p className="employment-type">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="horizontal-line" />
          <div className="description-and-visit-website-container">
            <h1 className="job-detail-description-heading">Description</h1>
            <a
              href={companyWebsiteUrl}
              rel="noreferrer"
              target="_blank"
              className="website-link"
            >
              <p className="visit">Visit</p>
              <FiExternalLink className="external-link-icon" />
            </a>
          </div>
          <p className="job-detail-description">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list">
            {skills.map(each => (
              <li className="skill-item" key={each.name}>
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="skill-image"
                />
                <p className="skill">{each.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="life-at-company-description">{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
        {renderSimilarJobList()}
      </>
    )
  }

  const renderApiStatusView = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderJobItemDetails()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return (
    <div className="job-item-details-container">
      <Header />
      <div className="job-item-details">
        <div className="job-item-responsive-container">
          {renderApiStatusView()}
        </div>
      </div>
    </div>
  )
}

export default JobItemDetails
