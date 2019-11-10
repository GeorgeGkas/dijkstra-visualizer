import React from 'react'
import { Link } from 'react-router-dom'
import Wrapper from './styles'

const Page404 = () => (
  <Wrapper>
    <div className="not-found parallax">
      <div className="sky-bg" />
      <div className="wave-7" />
      <div className="wave-6" />
      <Link className="wave-island" to="/">
        <img
          alt="Island"
          src="http://res.cloudinary.com/andrewhani/image/upload/v1524501929/404/island.svg"
        />
      </Link>
      <div className="wave-5" />
      <div className="wave-lost wrp">
        <span>4</span>
        <span>0</span>
        <span>4</span>
      </div>
      <div className="wave-4" />
      <div className="wave-boat">
        <img
          alt="Boat"
          className="boat"
          src="http://res.cloudinary.com/andrewhani/image/upload/v1524501894/404/boat.svg"
        />
      </div>
      <div className="wave-3" />
      <div className="wave-2" />
      <div className="wave-1" />
      <div className="wave-message">
        <p>The destination does not exist.</p>
        <p>Click on the island to return</p>
      </div>
    </div>
    <p className="credit">
      Page designed by{' '}
      <a
        href="https://codepen.io/andrew-lawendy"
        rel="noreferrer noopener"
        target="_blank"
      >
        Andrew Lawendy
      </a>
      .
    </p>
  </Wrapper>
)

export default Page404
