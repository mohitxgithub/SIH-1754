"use client"
import styles from "@/styles/style";
import  Navbar  from "@/components/Navbar";
import  Hero  from "@/components/Hero";
import  Stats  from "@/components/Stats";
import  Business  from "@/components/Business";
import  Billing  from "@/components/Billing";
import  CardDeal  from "@/components/CardDeal";
import  CTA  from "@/components/CTA";
import  Footer  from "@/components/Footer";

const Home: React.FC = () => {
  return (
    <>
      <div className="bg-[#F0F8FF] w-full overflow-hidden">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
            <Navbar />
          </div>
        </div>
        <div className={`${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Hero />
          </div>
        </div>
        <div className={`${styles.paddingX} ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Stats />
            <Business />
            <Billing />
            <CardDeal />
            <CTA />
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home