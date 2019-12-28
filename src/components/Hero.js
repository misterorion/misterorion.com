import React from "react"
import Me from "../../content/images/me.jpg"
export default () => {
  return (
    <div className="flex w-auto mb-8 p-6 items-center border border-teal-400 rounded shadow">
      <div className="w-1/3 sm:w-1/3 lg:w-1/4 mr-6" >
        <img src={Me} alt="Orion Anderson" className="w-40"/>
      </div>
        <div className="w-2/3 sm:w-2/3 lg:w-3/4 text-xl sm:text-lg lg:text-xl xl:text-2xl leading-snug">
          Greetings! My name is Orion Anderson. I'm a DevOps Developer located in New York City. I love all things Linux, Docker, AWS and automation. I also dabble in
          front-end development.
        </div>
    </div>
  )
}
