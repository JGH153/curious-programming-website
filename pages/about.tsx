import React, { useState } from "react";
import { Header } from "../components/header";

function About(props: { a: number }) {
  console.log("a", props.a);
  const [val, toggle] = useState(1);
  return (
    <>
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
        <div className="shrink-0">
          <img
            className="h-12 w-12"
            src="https://tailwindcss.com/_next/static/media/classic-utility-jacket.0f108046e151c8576017eaf383406fe6.jpg"
            alt="ChitChat Logo"
          />
        </div>
        <div>
          <div className="text-xl font-medium text-black">ChitChat</div>
          <p className="text-slate-500">You have a new message!</p>
        </div>
      </div>
    </>
  );
}

// <a href="https://www.flaticon.com/free-icons/youtube" title="youtube icons">Youtube icons created by Freepik - Flaticon</a>
// <a href="https://www.flaticon.com/free-icons/medium" title="medium icons">Medium icons created by Freepik - Flaticon</a>
// <a href="https://www.flaticon.com/free-icons/twitter" title="twitter icons">Twitter icons created by Freepik - Flaticon</a>

export async function getStaticProps() {
  return {
    props: { a: 1 }, // will be passed to the page component as props
  };
}

export default About;
