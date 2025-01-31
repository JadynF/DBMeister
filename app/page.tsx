import "@/styles/Landing.css";
import Link from "next/link";

export default function Home() {

  return (
      <div className = "page">
          <header className = "landing-header">
              <div className = "header-title">
                  <h1>DBMeister</h1>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <a href = "https://github.com/JadynF/DBMeister">Github</a>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <a href = "https://dbmeister.readthedocs.io/en/latest/">Docs</a>
              </div>
              <div className = "header-buttons">
                  <Link href="/register">
                    <button className = "header-signup">Sign Up!</button>
                  </Link>
                  <Link href="/login">
                    <button className = "header-signin">Sign In</button>
                  </Link>
              </div>
          </header>
          <div className = "landing-body">
              <div className = "body-centered-main">
                  <div className = "inner-text">
                      <h1 className = "font-bold text-3xl">Create Free Online Schema Diagrams!</h1>
                      <p>Speed up production and boost understanding in your project by creating a detailed schema. DBMeister allows you to show not only internal data flow, but external as well. The ultimate tool to minimize confusion in your database project.</p>
                      <Link href="/projectEditor">
                        <button className = "header-signup">Create Diagram!</button>
                      </Link>
                  </div>
              </div>
              <div className = "body-full">
                  <div className = "collab-text">
                      <h1 className = "font-bold text-2xl">External Mapping</h1>
                      <h3>DBMeister gives developers the ability to not only design their internal data flow, but also any external sources accessing their data. Giving everyone the complete picture on the project and minimizing confusion. </h3>
                  </div>
                  <div className = "external-image">
                  </div>
              </div>
              <div className = "body-full">
                  <div className = "collab-image">
                  </div>
                  <div className = "collab-text">
                      <h1 className = "font-bold text-2xl">Increased Collaboration</h1>
                      <h3>DBMeister nurtures collaboration within a development team. Groups can be created within DBMeister so that developer teams can seamlessly work together on the same diagram. Members of the group can interact with each other with a group chat, group priviledge management, real-time diagram changes, and more!</h3>
                  </div>
              </div>
          </div>
      </div>
  );
}