import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../utils/supabase";
import { Calendar, MapPin, Share2, Clock, CalendarPlus } from "lucide-react";
import { format } from "date-fns";
import { getImagePath } from "../../utils/imageUtils";
import { toast } from "sonner";

const FALLBACK_IMAGE = getImagePath("trip-placeholder.jpg");

const UpcomingEvents = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll to event if ID is in share URL
  useEffect(() => {
    // Check if there's an eventId parameter in the URL
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("eventId");

    if (eventId && !loading && events.length > 0) {
      const eventElement = document.getElementById(`event-${eventId}`);
      if (eventElement) {
        // Add a slight delay to ensure rendering is complete
        setTimeout(() => {
          eventElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          // Highlight the element temporarily
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

        // Fetch upcoming events (datetime >= current date)
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .gte("datetime", currentDate.toISOString())
          .order("datetime", { ascending: true })
          .limit(10);

        if (error) throw error;

        setEvents(data || []);
      } catch (err) {
        console.error("Error fetching upcoming events:", err);
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
    e.target.setAttribute("image-credit", "Jonatan Pie");
  };

  // Format date display
  const formatEventDateTime = (datetime) => {
    const date = new Date(datetime);
    return format(date, "MMMM d, yyyy, hh:mm a");
  };

  // Generate a sharable URL for an event
  const getEventShareUrl = (event) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?eventId=${event.id}`;
  };

  // Generate calendar links for different platforms
  const generateCalendarLinks = (event) => {
    const startDate = new Date(event.datetime);
    // Assume 2-hour duration if no end time specified
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const formatForCalendar = (date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const eventDetails = {
      title: encodeURIComponent(event.title),
      description: encodeURIComponent(event.subtitle || ""),
      location: encodeURIComponent(event.location || ""),
      startTime: formatForCalendar(startDate),
      endTime: formatForCalendar(endDate),
    };

    return {
      google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventDetails.title}&dates=${eventDetails.startTime}/${eventDetails.endTime}&details=${eventDetails.description}&location=${eventDetails.location}`,
      outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${eventDetails.title}&startdt=${eventDetails.startTime}&enddt=${eventDetails.endTime}&body=${eventDetails.description}&location=${eventDetails.location}`,
      ics: createICSFile(event, startDate, endDate),
    };
  };

  // Create ICS file content for native calendar apps
  const createICSFile = (event, startDate, endDate) => {
    const formatICSDate = (date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//ESN Skövde//Event Calendar//EN",
      "BEGIN:VEVENT",
      `UID:${event.id}@esnskovde.org`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.subtitle || ""}`,
      `LOCATION:${event.location || ""}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
  };

  // Event share functionality
  const shareEvent = (event) => {
    const shareUrl = getEventShareUrl(event);

    if (navigator.share) {
      navigator
        .share({
          text: `${t("events.join")} ESN Skövde's ${
            event.title
          } on ${formatEventDateTime(event.datetime)} at ${
            event.location
          }\n${shareUrl}`,
        })
        .catch((error) => {
          console.error("Error sharing event:", error);
          toast.error(t("events.shareError"));
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

  // Add event to calendar functionality
  const addToCalendar = (event) => {
    const calendarLinks = generateCalendarLinks(event);
    const userAgent = navigator.userAgent.toLowerCase();

    try {
      // Detect platform and open appropriate calendar
      if (userAgent.includes("android")) {
        // Android - try Google Calendar first, fallback to ICS
        window.open(calendarLinks.google, "_blank");
      } else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
        // iOS - use ICS file which will open in native Calendar app
        window.location.href = calendarLinks.ics;
      } else if (userAgent.includes("mac")) {
        // macOS - use ICS file which will open in native Calendar app
        const link = document.createElement("a");
        link.href = calendarLinks.ics;
        link.download = `${event.title
          .replace(/[^a-z0-9]/gi, "_")
          .toLowerCase()}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Windows/Linux/Other - offer choice or default to Google Calendar
        window.open(calendarLinks.google, "_blank");
      }

      toast.success(t("events.addedToCalendar"));
    } catch (error) {
      console.error("Error adding to calendar:", error);
      toast.error(t("events.calendarError"));
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
            {t("events.upcomingEvents")}
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
            {t("events.upcomingEvents")}
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
            {t("events.upcomingEvents")}
          </h3>
          <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {t("events.noUpcomingEvents")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Title */}
        <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
          <Clock className="w-5 h-5 mr-2" />
          {t("events.upcomingEvents")}
        </h3>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
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
                  className="w-full h-full object-cover"
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

                {/* Event Buttons - Always at bottom */}
                <div className="flex space-x-2 mt-auto">
                  {event.ticketPurchaseLink ? (
                    <>
                      <a
                        href={event.ticketPurchaseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center font-medium transition-colors duration-200"
                      >
                        {t("events.buyTickets")}
                      </a>
                      <button
                        onClick={() => addToCalendar(event)}
                        className="flex items-center justify-center bg-green-200 dark:bg-green-700 hover:bg-green-300 dark:hover:bg-green-600 text-green-700 dark:text-green-200 p-2 rounded transition-colors duration-200"
                        aria-label={t("events.addToCalendar")}
                      >
                        <CalendarPlus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => shareEvent(event)}
                        className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-2 rounded transition-colors duration-200"
                        aria-label={t("events.share")}
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => addToCalendar(event)}
                        className="flex-1 flex items-center justify-center bg-green-200 dark:bg-green-700 hover:bg-green-300 dark:hover:bg-green-600 text-green-700 dark:text-green-200 py-2 px-4 rounded font-medium transition-colors duration-200"
                      >
                        <CalendarPlus className="w-5 h-5 mr-2" />
                        {t("events.addToCalendar")}
                      </button>
                      <button
                        onClick={() => shareEvent(event)}
                        className="flex-1 flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded font-medium transition-colors duration-200"
                      >
                        <Share2 className="w-5 h-5 mr-2" />
                        {t("events.share")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
