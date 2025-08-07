import React ,{useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import SymptomChecker from '../components/SymptomChecker'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import Chatbot from '../components/Chatbot'
import ScrollAnimateWrapper from '../components/ScrollAnimateWrapper'
import { useEffect } from 'react'

const Home = () => {

  const { token, authChecked } = useContext(AppContext);
  const navigate = useNavigate();

  // 🔁 Redirect if already logged in
  useEffect(() => {
    if (authChecked && token) {
      navigate('/main');
    }
  }, [authChecked, token, navigate]);

  // 🛑 Wait for auth check to avoid flicker
  if (!authChecked) return null;

  return (
    <div className="relative min-h-screen">
      <ScrollAnimateWrapper animation="slideUp" duration={0.6}>
        <Header />
      </ScrollAnimateWrapper>

      <ScrollAnimateWrapper animation="fadeIn" duration={0.6} delay={0.1}>
        <SpecialityMenu />
      </ScrollAnimateWrapper>

      <ScrollAnimateWrapper animation="slideLeft" duration={0.6} delay={0.2}>
        <SymptomChecker />
      </ScrollAnimateWrapper>

      <ScrollAnimateWrapper animation="zoomIn" duration={0.6} delay={0.3}>
        <TopDoctors />
      </ScrollAnimateWrapper>

      <ScrollAnimateWrapper animation="slideUp" duration={0.6} delay={0.4}>
        <Banner />
      </ScrollAnimateWrapper> 
      
      
      {/* Chatbot should stay fixed and outside scroll animation */}
      <Chatbot />

      {/* Optional space at bottom */}
      {/* <div className="h-[100px]"></div>
      <div className="h-[100px]"></div> */}
    </div>
  )
}

export default Home
