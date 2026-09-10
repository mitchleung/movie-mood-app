import React from 'react'

const Footer = () => {
  return (
  <footer className="mx-auto px-8 py-10 max-width-7xl">
    &copy; {(new Date()).getFullYear()} All rights reserved.
  </footer>
  )
}

export default Footer