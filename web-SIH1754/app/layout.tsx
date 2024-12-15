import "@/styles/globals.css";
export const metadata = {
  title: "Seva Flow",
  description: "Seva Flow is a cutting-edge digital platform for the Department of Posts, designed to drive sustainability efforts. It empowers field workers and communities by providing real-time data insights, fostering transparency, and enabling action towards environmental and social impact."
};

const RootLayout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
