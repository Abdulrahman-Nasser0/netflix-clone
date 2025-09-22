import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../stores/authStore";
import Layout from "../components/Layout";
import NetflixInput from "../components/ui/NetflixInput";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  // Pre-fill email if coming from Home page
  useEffect(() => {
    if (location.state?.email) {
      setFormData((prev) => ({
        ...prev,
        email: location.state.email,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await register(formData);

    if (result.success) {
      // Redirect to login
      setErrors({
        success:
          "Registration successful! Please sign in with your credentials.",
      });
      setTimeout(() => {
        navigate("/login", { state: { email: formData.email } });
      }, 2000);
    } else {
      if (result.errors) {
        setErrors(result.errors);
      } else {
        setErrors({ general: result.error || "Registration failed" });
      }
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-scree flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Netflix Logo */}
          <div className="text-center">
            <Link to="/" className="text-red-600 font-bold text-4xl">
              NETFLIX
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-white">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Join millions of users enjoying unlimited entertainment
            </p>
          </div>

          {/* Registration Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* General Error or Success */}
            {errors.general && (
              <div className="bg-red-600 text-white p-3 rounded-md text-sm">
                {errors.general}
              </div>
            )}

            {errors.success && (
              <div className="bg-green-600 text-white p-3 rounded-md text-sm">
                {errors.success}
              </div>
            )}
            {/* Input Fields */}
            <div className="space-y-4">
              {/* Name Field */}
              <NetflixInput
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                errorMessage={errors.name}
              />

              {/* Email Field */}
              <NetflixInput
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                errorMessage={errors.email}
              />

              {/* Password Field */}
              <NetflixInput
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                errorMessage={errors.password}
              />

              {/* Confirm Password Field */}
              <NetflixInput
                type="password"
                name="password_confirmation"
                placeholder="Confirm Password"
                value={formData.password_confirmation}
                onChange={handleChange}
                error={!!errors.password_confirmation}
                errorMessage={errors.password_confirmation}
              />
            </div>

            <div>
            {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                } transition-colors duration-200`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
            
            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-red-600 hover:text-red-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>

        </div>
      </div>
    </Layout>
  );
};

export default Register;
