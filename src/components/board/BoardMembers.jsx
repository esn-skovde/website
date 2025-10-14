import { useTranslation } from "react-i18next";
import { Instagram, Linkedin, Mail } from "lucide-react";
import boardMembersData from "../../data/boardMembers.json";
import { getImagePath } from "../../utils/imageUtils";
import PageTitle from "../common/PageTitle";

const PROFILE_FALLBACK_IMAGE = getImagePath("board/profile_fallback.jpg");

const BoardMembers = () => {
    const { t } = useTranslation();
    const { mascot, boardMembers } = boardMembersData;

    // Handle image error for board member photos
    const handleImageError = (e) => {
        e.target.src = PROFILE_FALLBACK_IMAGE;
        // Prevent infinite loop if fallback also fails
        e.target.onerror = null;
    };

    return (
        <>
            <PageTitle title={t("boardMembers.title")} />
        <section id="board-members" className="py-16">
            <div className="container mx-auto px-4">
                {/* Board Members Title */}
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                    {t("boardMembers.title")}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Mascot Card */}
                    <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 mb-8">
                        <div className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 rounded-xl shadow-xl overflow-hidden">
                            <div className="p-8 flex flex-col md:flex-row items-center">
                                {/* Mascot Image Container */}
                                <div className="w-full md:w-1/3 mb-6 md:mb-0">
                                    <div className="rounded-full overflow-hidden border-4 border-white h-64 w-64 mx-auto">
                                        <img
                                            src={getImagePath('board/' + mascot.image)}
                                            alt={mascot.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                {/* Mascot Information */}
                                <div className="w-full md:w-2/3 md:pl-8 text-white">
                                    <div className="inline-block px-4 py-2 bg-white/20 rounded-full mb-4">
                                        {t("boardMembers.mascot")}
                                    </div>
                                    <h3 className="text-3xl font-bold mb-2">
                                        {mascot.name}
                                    </h3>
                                    <p className="text-lg mb-4">
                                        {t("boardMembers.mascotDay")}:{" "}
                                        {mascot.mascotDay}
                                    </p>
                                    <p className="text-lg">
                                        {t("boardMembers.mascotDescription")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Board Member Cards */}
                    {boardMembers.map((member) => (
                        <div
                            key={member.id}
                            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full"
                        >
                            <div className="relative flex-shrink-0">
                                {/* Nationality Flag in top right corner */}
                                <div
                                    className="absolute top-3 right-3 text-lg z-10 bg-white/90 dark:bg-gray-800/90 rounded-full min-w-10 h-10 px-2 flex items-center justify-center shadow-sm whitespace-nowrap"
                                    aria-label={`Flag representing ${member.flag}`}
                                >
                                    {member.flag}
                                </div>
                                {/* Image Container  */}
                                <div className="aspect-[3/4] w-full overflow-hidden">
                                    <img
                                        src={getImagePath('board/'+member.image) || PROFILE_FALLBACK_IMAGE}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                        onError={handleImageError}
                                    />
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                {/* Header Info */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                                        {member.name}
                                    </h3>
                                    <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                                        {member.role}
                                    </p>
                                </div>

                                {/* Additional Information - Languages, Studies, and ESN Join Date */}
                                <div className="mb-4 space-y-2 flex-1">
                                    <div className="text-xs text-gray-600 dark:text-gray-300">
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">Languages:</span>{" "}
                                        <span className="text-gray-600 dark:text-gray-400">{member.languages?.join(", ")}</span>
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-300">
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">Studies:</span>{" "}
                                        <span className="text-gray-600 dark:text-gray-400">{member.studies}</span>
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-300">
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">Joined ESN:</span>{" "}
                                        <span className="text-gray-600 dark:text-gray-400">{member.esn_join_date}</span>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="flex justify-center space-x-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                                    {member.email && (
                                        <a
                                            href={`mailto:${member.email}`}
                                            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                            aria-label={`Email ${member.name}`}
                                        >
                                            <Mail size={18} />
                                        </a>
                                    )}
                                    {member.social.instagram && (
                                        <a
                                            href={`https://instagram.com/${member.social.instagram}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                            aria-label={`${member.name}'s Instagram profile`}
                                        >
                                            <Instagram size={18} />
                                        </a>
                                    )}
                                    {member.social.linkedin && (
                                        <a
                                            href={`https://www.linkedin.com/in/${member.social.linkedin}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-500 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-300 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                            aria-label={`${member.name}'s LinkedIn profile`}
                                        >
                                            <Linkedin size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            </section>
        </>
    );
};

export default BoardMembers;
