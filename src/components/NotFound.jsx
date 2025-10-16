import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function NotFound() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  // Redirect to home page after 5 seconds
  useEffect(() => {
    const redirectTimer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(redirectTimer);
          navigate('/');
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(redirectTimer);
  }, [navigate]);


  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-center">
              <h2 className="text-6xl font-bold text-red-500 mb-4">{t("notFound.title")}</h2>
              <p className="text-gray-600 mb-6">{t("notFound.message")}</p>
              <div
                  className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
                  role="alert"
              >
                  <span className="block sm:inline">
                      {t("notFound.redirectMessage", { countdown })}
                  </span>
              </div>
              <button
                  onClick={() => navigate("/")}
                  className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                  {t("notFound.goBackHomeNow")}
              </button>
          </div>
      </div>
    </>
  );
}

export default NotFound;