import styles, { layout } from "@/styles/style";
import Button from "./Button";
import Image from "next/image";
const CardDeal: React.FC = () => (
  <section className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
      Accelerating Sustainability with Data Insights
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
      Track, optimize, and drive sustainability efforts with real-time data insights and visualizations to enhance resource management and community impact.
      </p>
      <Button styles="mt-10" />
    </div>
    <div className={layout.sectionImg}>
      <Image src='/assets/garph1.png' alt="card" width={1000} height={800} />
    </div>
  </section>
);

export default CardDeal;
