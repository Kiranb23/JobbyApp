import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'
import BeatLoader from 'react-spinners/BeatLoader'

import FiltersGroup from '../FiltersGroup'
import JobsHeader from '../JobsHeader'
import Header from '../Header'
import JobItem from '../JobItem'
import Profile from '../Profile'

import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const Jobs = () => {
  const [jobsList, setJobsList] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [activeEmploymentTypeIds, setActiveEmploymentTypeIds] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [activeSalaryRangeId, setActiveSalaryRangeId] = useState('')

  const getJobs = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const employmentType = activeEmploymentTypeIds.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.jobs.map(job => ({
        title: job.title,
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
        id: job.id,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
      }))
      setJobsList(updatedData)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getJobs()
  }, [activeEmploymentTypeIds, activeSalaryRangeId, searchInput])

  const changeSalaryRange = id => {
    setActiveSalaryRangeId(id)
  }

  const changeEmploymentType = (checked, id) => {
    setActiveEmploymentTypeIds(prev =>
      checked ? [...prev, id] : prev.filter(typeId => typeId !== id),
    )
  }

  const enterSearchInput = () => {
    getJobs()
  }

  const changeSearchInput = input => {
    setSearchInput(input)
  }

  const renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <BeatLoader color="#ffffff" size="50px" />
    </div>
  )

  const renderFailureView = () => (
    <div className="failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-view-img"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={getJobs}>
        Retry
      </button>
    </div>
  )

  const renderNoJobsView = () => (
    <div className="jobs-not-found-container">
      <img
        alt="no jobs"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="jobs-not-found-img"
      />
      <h1 className="jobs-not-found-heading">No Jobs Found</h1>
      <p className="jobs-not-found-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  const renderJobsList = () =>
    jobsList.length === 0 ? (
      renderNoJobsView()
    ) : (
      <ul className="jobs-list">
        {jobsList.map(job => (
          <JobItem key={job.id} jobData={job} />
        ))}
      </ul>
    )

  const renderJobs = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderJobsList()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return (
    <div className="jobs-container">
      <Header />
      <div className="jobs">
        <div className="jobs-responsive-container">
          <div className="search-bar-mobile">
            <JobsHeader
              enterSearchInput={enterSearchInput}
              changeSearchInput={changeSearchInput}
              searchInput={searchInput}
            />
          </div>
          <div className="profile-and-filters-container">
            <Profile />
            <hr className="horizontal-line" />
            <FiltersGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              changeEmploymentType={changeEmploymentType}
              changeSalaryRange={changeSalaryRange}
            />
          </div>
          <div className="jobs-list-container">
            <div className="desktop-search-bar">
              <JobsHeader
                enterSearchInput={enterSearchInput}
                changeSearchInput={changeSearchInput}
                searchInput={searchInput}
              />
            </div>
            {renderJobs()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Jobs
