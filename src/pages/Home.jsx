import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import MovieCategoryRow from "../components/MovieCategoryRow";
import NetflixInput from "../components/ui/NetflixInput";
import MovieModal from "../components/ui/MovieModal";
import { movieCategories } from "../services/api/tmdb";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGetStarted = () => {
    if (!email.trim()) {
      setEmailError("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    navigate("/register", { state: { email } });
  };
  

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleGetStarted();
    }
  };
  return (
    <Layout>
      {isAuthenticated ? null : (
        <div className="min-h-screen relative flex items-center justify-center -mt-16 pt-16">

          <div className="relative z-10 flex items-center justify-center flex-col px-4 sm:px-8 md:px-16 max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl sm:text-4xl lg:text-6xl lg:font-extrabold font-bold mb-4">
              Unlimited movies, TV shows, and more
            </h1>
            <p className="text-gray-100 text-lg sm:text-xl lg:text-2xl mb-4">
              Starts at EGP 100. Cancel anytime.
            </p>
            <p className="text-gray-100 text-lg sm:text-xl lg:text-2xl mb-8">
              Ready to watch? Enter your email to create or restart your
              membership.
            </p>

            {/* Email Input & Get Started Button */}
            <div className="flex flex-col sm:flex-row justify-center items-start gap-4 w-full max-w-2xl">
              <div className="w-full">
                <NetflixInput
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyDown={handleKeyDown}
                  error={!!emailError}
                  errorMessage={emailError}
                  className="w-full"
                />
              </div>
              <button
                onClick={handleGetStarted}
                className="
                bg-red-600 
                hover:bg-red-700 
                text-white 
                px-6
                py-4
                rounded 
                text-lg 
                font-semibold 
                transition-colors 
                duration-200
                whitespace-nowrap
                flex
                items-center
                justify-center
                h-[3.2rem]
                mx-auto
                sm:w-auto
              "
              >
                Get Started
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movie Categories*/}
      <div className="mx-auto mt-8 py-8">
        {movieCategories.map((category, index) => (
          <MovieCategoryRow 
            key={index} 
            category={category} 
            onMovieClick={setSelectedMovie}
          />
        ))}
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </Layout>
  );
};

export default Home;
