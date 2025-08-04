import React from 'react'

const NetflixBg = () => {
  return (
    <div
      className={`
        absolute
        top-0
        left-0
        w-full
        h-screen
        bg-cover
        bg-center
        bg-no-repeat
        -z-10
      `}
      style={{
        backgroundImage: "url('/images/home-bg.jpg')",
      }}
    >
      {/* Netflix-style dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90"></div>
    </div>
  )
}

export default NetflixBg