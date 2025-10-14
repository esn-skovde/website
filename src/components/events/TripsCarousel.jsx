import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin, ArrowLeft, ArrowRight, CalendarPlus } from "lucide-react";
import { supabase } from "../../utils/supabase";
import { format, isPast, isFuture, isWithinInterval } from "date-fns";
import { getImagePath } from "../../utils/imageUtils";
import { toast } from "sonner";


const FALLBACK_IMAGE = getImagePath("trip-placeholder.jpg");

const TripsCarousel = () => {
    const { t } = useTranslation();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const timerRef = useRef(null);

    // Fetch trips data
    useEffect(() => {
        const fetchTrips = async () => {
            try {


                setLoading(true);
                const currentDate = new Date();

                // store trip IDs to avoid duplicates
                const tripIds = new Set();

                // Fetch upcoming trips, limited to 10
                const { data: allTrips, error: tripsError } = await supabase
                    .from("trips")
                    .select("*")
                    .gte("startsAt", currentDate.toISOString())
                    .order("startsAt", { ascending: true })
                    .limit(10);

                for (const trip of allTrips) {
                    tripIds.add(trip.id);
                }

                if (tripsError) throw tripsError;

                // If total trips are less than 10, fetch additional past trips
                if (allTrips.length < 10) {

                    const { data: additionalPastTrips, error: pastError } =
                        await supabase
                            .from("trips")
                            .select("*")
                            .filter("endsAt", "lt", currentDate.toISOString())
                            .order("endsAt", { ascending: false })
                            .limit(10);

                    if (pastError) throw pastError;

                    // Add additional past trips to allTrips
                    for (const trip of additionalPastTrips) {

                        if (allTrips.length >= 10) break; // Limit to 10 trips

                        if (!tripIds.has(trip.id)) {
                            allTrips.push(trip);
                            tripIds.add(trip.id);
                        }
                    }
                }




                // Categorize trips
                const upcomingTrips = [];
                const currentTrips = [];
                const pastTrips = [];

                for (const trip of allTrips) {
                    const startDate = safeParseDate(trip.startsAt);
                    const endDate = safeParseDate(trip.endsAt);

                    // Skip trips with invalid dates
                    if (!startDate || !endDate) {
                        console.warn('Skipping trip with invalid dates:', trip);
                        continue;
                    }

                    if (isFuture(startDate)) {
                        upcomingTrips.push(trip);
                        continue;
                    }

                    if (isWithinInterval(startDate, endDate)) {
                        currentTrips.push(trip);
                        continue;
                    }

                    if (isPast(endDate)) {
                        pastTrips.push(trip);
                    }
                }


                // Sort each category
                upcomingTrips.sort(
                    (a, b) => {
                        const dateA = safeParseDate(a.startsAt);
                        const dateB = safeParseDate(b.startsAt);
                        if (!dateA || !dateB) return 0;
                        return dateA - dateB;
                    }
                ); // Earliest start date first
                currentTrips.sort(
                    (a, b) => {
                        const dateA = safeParseDate(a.endsAt);
                        const dateB = safeParseDate(b.endsAt);
                        if (!dateA || !dateB) return 0;
                        return dateB - dateA;
                    }
                ); // Latest end date first
                pastTrips.sort(
                    (a, b) => {
                        const dateA = safeParseDate(a.endsAt);
                        const dateB = safeParseDate(b.endsAt);
                        if (!dateA || !dateB) return 0;
                        return dateB - dateA;
                    }
                ); // Most recent past trips first

                const combinedTrips = [...upcomingTrips, ...currentTrips, ...pastTrips];

                setTrips(combinedTrips);
            } catch (err) {
                console.error("Error fetching trips:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // Navigation handlers
    const goToNext = useCallback(() => {
        if (trips.length <= 1) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % trips.length);
    }, [trips.length]);

    // Reset timer function
    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        if (trips.length > 1) {
            timerRef.current = setInterval(() => {
                goToNext();
            }, 10000);
        }
    }, [goToNext, trips.length]);

    // Set up automatic carousel rotation after data is loaded
    useEffect(() => {
        if (!loading && trips.length > 0) {
            resetTimer();
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [loading, trips.length, resetTimer]);

    // Navigation handlers
    const goToPrev = useCallback(() => {
        if (trips.length <= 1) return;
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + trips.length) % trips.length
        );
        resetTimer();
    }, [trips.length, resetTimer]);

    // Handle image error
    const handleImageError = (e) => {
        e.target.src = FALLBACK_IMAGE;
    };

    // Safe date parsing helper
    const safeParseDate = (dateString) => {
        try {
            if (!dateString) return null;
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? null : date;
        } catch (error) {
            console.warn('Invalid date string:', dateString, error);
            return null;
        }
    };

    // Format date display
    const formatDateRange = (startDate, endDate) => {
        const start = safeParseDate(startDate);
        const end = safeParseDate(endDate);

        if (!start || !end) {
            return 'Invalid date';
        }

        // If same date, show only one date
        if (start.toDateString() === end.toDateString()) {
            return format(start, "MMMM d, yyyy");
        }

        // If different dates, show range
        return `${format(start, "MMMM d")} - ${format(end, "MMMM d, yyyy")}`;
    };

    // Check if a trip is completed
    const isTripCompleted = (endDate) => {
        const date = safeParseDate(endDate);
        return date ? isPast(date) : false;
    };

    // Generate calendar links for different platforms
    const generateCalendarLinks = (trip) => {
        const startDate = safeParseDate(trip.startsAt);
        const endDate = safeParseDate(trip.endsAt);

        if (!startDate || !endDate) {
            throw new Error('Invalid trip dates');
        }

        const formatForCalendar = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const tripDetails = {
            title: encodeURIComponent(trip.title),
            description: encodeURIComponent(trip.subtitle || ''),
            location: encodeURIComponent(trip.location || ''),
            startTime: formatForCalendar(startDate),
            endTime: formatForCalendar(endDate)
        };

        return {
            google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${tripDetails.title}&dates=${tripDetails.startTime}/${tripDetails.endTime}&details=${tripDetails.description}&location=${tripDetails.location}`,
            outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${tripDetails.title}&startdt=${tripDetails.startTime}&enddt=${tripDetails.endTime}&body=${tripDetails.description}&location=${tripDetails.location}`,
            ics: createICSFile(trip, startDate, endDate)
        };
    };

    // Create ICS file content for native calendar apps
    const createICSFile = (trip, startDate, endDate) => {
        const formatICSDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//ESN Skövde//Trip Calendar//EN',
            'BEGIN:VEVENT',
            `UID:trip-${trip.id}@esnskovde.org`,
            `DTSTART:${formatICSDate(startDate)}`,
            `DTEND:${formatICSDate(endDate)}`,
            `SUMMARY:${trip.title}`,
            `DESCRIPTION:${trip.subtitle || ''}`,
            `LOCATION:${trip.location || ''}`,
            'STATUS:CONFIRMED',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
    };

    // Add trip to calendar functionality
    const addToCalendar = (trip) => {
        try {
            const calendarLinks = generateCalendarLinks(trip);
            const userAgent = navigator.userAgent.toLowerCase();

            // Detect platform and open appropriate calendar
            if (userAgent.includes('android')) {
                // Android - try Google Calendar first, fallback to ICS
                window.open(calendarLinks.google, '_blank');
            } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
                // iOS - use ICS file which will open in native Calendar app
                window.location.href = calendarLinks.ics;
            } else if (userAgent.includes('mac')) {
                // macOS - use ICS file which will open in native Calendar app
                const link = document.createElement('a');
                link.href = calendarLinks.ics;
                link.download = `${trip.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                // Windows/Linux/Other - offer choice or default to Google Calendar
                window.open(calendarLinks.google, '_blank');
            }

            toast.success(t("events.addedToCalendar"));
        } catch (error) {
            console.error("Error adding to calendar:", error);
            toast.error(t("events.calendarError"));
        }
    };



    // Loading skeletons
    if (loading) {
        return (
            <div className="py-8">
                <div className="relative w-full h-96 mb-4 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div className="animate-pulse flex flex-col items-center justify-center h-full">
                        <div className="w-3/4 h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                        <div className="w-1/2 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                        <div className="w-1/3 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Error carousel
    if (error) {
        return (
            <div className="py-8">
                <div className="relative w-full h-96 overflow-hidden mb-4">
                    <div className="absolute inset-0 bg-black">
                        <img
                            src={FALLBACK_IMAGE}
                            alt="Error"
                            className="w-full h-full object-cover opacity-70"
                            onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                        <h2 className="text-3xl md:text-4xl font-bold mb-2 max-w-3xl">
                            {t("common.error")}
                        </h2>
                        <p className="text-lg text-gray-200 mb-4 max-w-2xl">
                            {t("events.carousel.errorMessage")}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 inline-flex items-center"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // No trips found - show as a carousel
    if (trips.length === 0) {
        return (
            <div className="py-8">
                <div className="relative w-full h-96 mb-4 overflow-hidden">
                    <div className="absolute inset-0 bg-black">
                        <img
                            src={FALLBACK_IMAGE}
                            alt="No trips available"
                            className="w-full h-full object-cover opacity-70"
                            onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                        <h2 className="text-3xl md:text-4xl font-bold mb-2 max-w-3xl">
                            {t("events.carousel.noTrips")}
                        </h2>
                        <p className="text-lg text-gray-200 mb-4 max-w-2xl">
                            {t("events.carousel.checkBackLater")}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Current trip to display
    const currentTrip = trips[currentIndex];

    // Safety check for current trip
    if (!currentTrip) {
        return (
            <div className="py-8">
                <div className="relative w-full h-96 mb-4 overflow-hidden">
                    <div className="absolute inset-0 bg-black">
                        <img
                            src={FALLBACK_IMAGE}
                            alt="No trip available"
                            className="w-full h-full object-cover opacity-70"
                            onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                        <h2 className="text-3xl md:text-4xl font-bold mb-2 max-w-3xl">
                            {t("events.carousel.noTrips")}
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">

        <div className="relative mb-4 w-full h-96 overflow-hidden bg-black">
            {/* Current Trip Image */}
            <div className="absolute inset-0">
                {currentTrip?.thumbnail && (
                    <img
                        src={currentTrip.thumbnail || FALLBACK_IMAGE}
                        alt={currentTrip.title || 'Trip'}
                        className="w-full h-full object-cover opacity-70"
                        onError={handleImageError}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                {/* Current Trip Information */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 max-w-3xl">
                        {currentTrip.title}
                    </h2>
                    <p className="text-lg text-gray-200 mb-4 max-w-2xl">
                        {currentTrip.subtitle}
                    </p>

                    {/* Date and Location */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                        {currentTrip.startsAt && currentTrip.endsAt && (
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 mr-2" />
                                <span className="text-sm md:text-base">
                                    {formatDateRange(
                                        currentTrip.startsAt,
                                        currentTrip.endsAt
                                    )}
                                </span>
                            </div>
                        )}
                        {currentTrip.location && (
                            <div className="flex items-center">
                                <MapPin className="h-5 w-5 mr-2" />
                                <span className="text-sm md:text-base">
                                    {currentTrip.location}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Completed/More Details and Calendar Buttons */}
                    {isTripCompleted(currentTrip.endsAt) ? (
                        <button
                            disabled
                            className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg cursor-not-allowed opacity-75 inline-flex items-center"
                        >
                            Completed
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            {/* More Details Button */}
                            {currentTrip.detailsLink &&
                                currentTrip.detailsLink !== "#" && (
                                    <a
                                        href={currentTrip.detailsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 inline-flex items-center"
                                    >
                                        {t("events.carousel.moreDetails")}
                                    </a>
                                )}

                            {/* Add to Calendar Button */}
                            <button
                                onClick={() => addToCalendar(currentTrip)}
                                className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
                                aria-label={t("events.addToCalendar")}
                                title={t("events.addToCalendar")}
                            >
                                <CalendarPlus className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Only show navigation controls if have multiple trips */}
            {trips.length > 1 && (
                <>
                    {/* Navigation arrows */}
                    <button
                        onClick={goToPrev}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors z-30"
                        aria-label="Previous trip"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors z-30"
                        aria-label="Next trip"
                    >
                        <ArrowRight className="h-6 w-6" />
                    </button>

                    {/* Carousel Dots indicator */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                        {trips.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (index === currentIndex) return;
                                    setCurrentIndex(index);
                                    resetTimer();
                                }}
                                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                                    index === currentIndex
                                        ? "bg-white w-4"
                                        : "bg-white/50"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
        </div>
    );
};

export default TripsCarousel;
