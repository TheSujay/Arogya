import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import SymptomChecker from '../components/SymptomChecker'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import Chatbot from '../components/Chatbot'
import ScrollAnimateWrapper from '../components/ScrollAnimateWrapper'

const Home = () => {
  return (
    <div>
      <ScrollAnimateWrapper><Header /></ScrollAnimateWrapper>
      <ScrollAnimateWrapper><SpecialityMenu /></ScrollAnimateWrapper>
      <ScrollAnimateWrapper><SymptomChecker /></ScrollAnimateWrapper>
      <ScrollAnimateWrapper><TopDoctors /></ScrollAnimateWrapper>
      <ScrollAnimateWrapper><Banner /></ScrollAnimateWrapper>
      <ScrollAnimateWrapper><Chatbot /></ScrollAnimateWrapper>
      <div className="h-[100px]"></div>
      <div className="h-[100px]"></div>
    </div>
  )
}

export default Home
