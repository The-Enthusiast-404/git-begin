import { FaGithub, FaTwitter } from "react-icons/fa"
import { Link } from "@remix-run/react"
import { useTranslatedText } from "~/locale/languageUtility"

const Footer = () => {
  const t = useTranslatedText()

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('footer.gitBegin')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {t('footer.websitePowered')}{" "}
              <a
                href="https://www.netlify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Netlify
              </a>
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="https://github.com/The-Enthusiast-404/git-begin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
            >
              <FaGithub size={24} />
            </Link>
            <Link
              to="https://twitter.com/introvertedbot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
            >
              <FaTwitter size={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
