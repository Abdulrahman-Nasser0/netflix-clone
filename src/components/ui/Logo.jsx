import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div className="flex items-center">
          <Link to="/" className="">
            <img 
              src="/images/netflix-logo.png"
              alt="Netflix" 
              className="w-[8rem] -ml-2.5
                lg:w-[13rem] lg:-ml-4 lg:mt-4
              " 
            />
          </Link>
        </div>
  )
}

export default Logo