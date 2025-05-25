import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import SymptomChecker from '../components/SymptomChecker'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <SymptomChecker />  
      <TopDoctors />
      <Banner />
    </div>
  )
}

export default Home