"use client"

import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ThemeContext } from "../context/ThemeContext"
import { toast } from "react-toastify"
import { UserPlus, Mail, User, Lock, Loader2, Check } from "lucide-react"

const Register = () => {
  const { theme } = useContext(ThemeContext)
  const navigate = useNavigate()

  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
    // Clear error for this field when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!userData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!userData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (userData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    if (!userData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!userData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (userData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setSuccessMessage("")

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccessMessage("Registration successful! Redirecting to login...")
        toast.success("🎉 Registration successful!")
        setTimeout(() => navigate("/login"), 2000)
      } else {
        if (result.message) {
          // Handle specific error messages from the server
          if (result.message.includes("email")) {
            setErrors({ ...errors, email: result.message })
          } else if (result.message.includes("username")) {
            setErrors({ ...errors, username: result.message })
          } else {
            toast.error(result.message)
          }
        } else {
          toast.error("Registration failed. Please try again.")
        }
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                <UserPlus className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create an Account</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Join QuizMaster to create and share quizzes</p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 rounded-lg flex items-start gap-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={userData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.fullName
                        ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors disabled:opacity-70`}
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">@</span>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    value={userData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.username
                        ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors disabled:opacity-70`}
                  />
                </div>
                {errors.username && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.email
                        ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors disabled:opacity-70`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={userData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.password
                        ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors disabled:opacity-70`}
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

