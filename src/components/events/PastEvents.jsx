import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../utils/supabase";
import { Calendar, MapPin, Share2, Clock } from "lucide-react";
import { format } from "date-fns";
import { getImagePath } from "../../utils/imageUtils";
import { toast } from "sonner";

const FALLBACK_IMAGE = getImagePath("trip-placeholder.jpg");

const PastEvents = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll to event if ID is in shareURL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("eventId");

    // scroll only when events are loaded
    if (eventId && !loading && events.length > 0) {
      const eventElement = document.getElementById(`event-${eventId}`);
      if (eventElement) {
        setTimeout(() => {
          eventElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          // Highlight the event card
          eventElement.classList.add(
            "ring-4",
            "ring-blue-400",
            "ring-opacity-75"
          );
          setTimeout(() => {
            eventElement.classList.remove(
              "ring-4",
              "ring-blue-400",
              "ring-opacity-75"
            );
          }, 2000);
        }, 300);
      }
    }
  }, [events, loading]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const currentDate = new Date();

        // Fetch past 10 events
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .lt("datetime", currentDate.toISOString())
          .order("datetime", { ascending: false })
          .limit(10);

        if (error) throw error;

        setEvents(data || []);
      } catch (err) {
        console.error("Error fetching past events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
    e.target.setAttribute("imageCredit", "Jonatan Pie");
  };

  // Format date display
  const formatEventDateTime = (datetime) => {
    const date = new Date(datetime);
    return format(date, "MMMM d, yyyy, hh:mm a");
  };

  const getEventShareUrl = (event) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?eventId=${event.id}`;
  };

  // event share functionality
  const shareEvent = (event) => {
    const shareUrl = getEventShareUrl(event);

    if (navigator.share) {
      navigator
        .share({
          title: event.title,
          text: event.subtitle,
          url: shareUrl,
        })
        .catch((error) => {
          toast.error(t("events.shareError"));
          console.log("Error sharing:", error);
        });
    } else {
      try {
        navigator.clipboard.writeText(shareUrl);
        toast.success(t("events.shareLinkCopied"));
      } catch (err) {
        console.error("Error copying link:", err);
        toast.error(t("events.shareNotSupported"));
      }
    }
  };

  {
    /* Loading Skeleton */
  }
  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
            <Clock className="w-5 h-5 mr-2" />
            {t("events.pastEvents")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="h-48 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-2/3 mb-4"></div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  {
    /* Error State */
  }
  if (error) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
            <Clock className="w-5 h-5 mr-2" />
            {t("events.pastEvents")}
          </h3>
          <div className="bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 p-4 rounded-lg">
            <p>
              {t("common.error")}: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  {
    /* No Events State */
  }
  if (events.length === 0) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
            <Clock className="w-5 h-5 mr-2" />
            {t("events.pastEvents")}
          </h3>
          <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {t("events.noPastEvents")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
          <Clock className="w-5 h-5 mr-2" />
          {t("events.pastEvents")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* Events Grid */}
          {events.map((event) => (
            <div
              key={event.id}
              id={`event-${event.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden scroll-mt-24 flex flex-col h-full"
            >
              {/* Event Image */}
              <div className="relative h-48">
                <img
                  src={event.thumbnail || FALLBACK_IMAGE}
                  alt={event.title}
                  className="w-full h-full object-cover brightness-75"
                  onError={handleImageError}
                  {...(event.imageCredit && {
                    "image-credit": event.imageCredit,
                  })}
                />
              </div>

              {/* Event Information */}
              <div className="p-4 flex flex-col flex-1">
                {/* Event Content - grows to fill space */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                  {/* Event Subtitle */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    {event.subtitle}
                  </p>

                  {/* Event Date and Location */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatEventDateTime(event.datetime)}</span>
                    </div>

                    {/* Event Location */}
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Buttons - Finished and Share */}
                <div className="flex space-x-2 mt-auto">
                  <button
                    disabled
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded text-center font-medium opacity-75 cursor-not-allowed"
                  >
                    {t("events.finished")}
                  </button>
                  <button
                    onClick={() => shareEvent(event)}
                    className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-2 rounded transition-colors duration-200"
                    aria-label={t("events.share")}
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PastEvents;
