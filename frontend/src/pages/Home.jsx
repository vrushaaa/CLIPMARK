import React from "react";
import { Link } from "react-router-dom";
import { Bookmark, Star, Archive, Tag, User, Send } from "lucide-react";
import Navbar from "../components/NavBar";
import Button from "../components/Button";

// Primary color: #48CAE4 (Cyan/Aqua)

function Home() {
  // Utility classes for thematic coloring
  const textPrimary = "text-[#48CAE4]";
  const bgAccentLight = "bg-white dark:bg-slate-800";
  const textTitle = "text-slate-900 dark:text-white";
  const textBody = "text-slate-600 dark:text-slate-400";
  const textHighlight = "text-slate-800 dark:text-slate-200";

  return (
    <div className="min-h-screen bg-[var(--color-sky-aqua-100)] dark:bg-slate-900 transition-colors duration-500 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-4xl w-full">
          <Bookmark
            size={64}
            className={`mx-auto ${textPrimary} mb-6 transform rotate-6 transition-all duration-500`}
          />

          {/* Title */}
          <h3
            className={`text-4xl md:text-6xl font-extrabold ${textTitle} mb-4 transition-colors duration-500`}
          >
            Your Links, Smarter and Organized 🚀
          </h3>

          {/* Subtitle */}
          <p
            className={`text-lg md:text-xl ${textBody} mb-12 max-w-3xl mx-auto transition-colors duration-500`}
          >
            ClipMark is more than a bookmark saver — it's your personal link
            library built to help you{" "}
            <b>store, tag, archive, and rediscover links instantly</b>.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4 mb-16">
            <Link to="/auth/signup">
              <Button>Create Account</Button>
            </Link>
            <Link
              to="/auth/login"
              className={`px-8 py-3 rounded-full text-lg font-bold border-2 border-[#48CAE4] ${textPrimary} hover:bg-[#48CAE4]/10 transition-colors duration-300`}
            >
              Sign In
            </Link>
          </div>

          {/* Why to use block (Elevated Card) */}
          <div
            className={`${bgAccentLight} shadow-2xl rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-12 max-w-4xl mx-auto`}
          >
            <h2 className={`text-3xl font-bold ${textTitle} mb-4`}>
              Why ClipMark is Better
            </h2>
            <p className={`text-base ${textBody} leading-relaxed space-y-3`}>
              <span className="flex items-start">
                <Send size={20} className={`mt-1 mr-3 ${textPrimary}`} />
                The internet is full of useful links, but browsers aren’t built
                to manage them well.
              </span>
              <span className="flex items-start">
                <Send size={20} className={`mt-1 mr-3 ${textPrimary}`} />
                <b>ClipMark</b> lets you organize links like a workspace, not a
                junk drawer.
              </span>
              <span className="flex items-start">
                <Send size={20} className={`mt-1 mr-3 ${textPrimary}`} />
                Add <b>Notes</b> to remember why a link matters, and use
                **Tags** to group links across topics.
              </span>
              <span className="flex items-start">
                <Send size={20} className={`mt-1 mr-3 ${textPrimary}`} />
                Save time with{" "}
                <b>
                  Duplicate detection, archive storage, and favourite marking
                </b>
                .
              </span>
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-10">
            {/* Card 1 */}
            <FeatureCard
              icon={Star}
              title="Favourites"
              description="Mark important links as favourites for instant, one-click access."
              textBody={textBody}
              textTitle={textHighlight}
              textPrimary={textPrimary}
            />

            {/* Card 2 */}
            <FeatureCard
              icon={Archive}
              title="Archive"
              description="Hide old links without deleting them—keep them safe and retrievable."
              textBody={textBody}
              textTitle={textHighlight}
              textPrimary={textPrimary}
            />

            {/* Card 3 */}
            <FeatureCard
              icon={Tag}
              title="Smart Tags"
              description="Label links across multiple topics, even if unrelated, using custom tags."
              textBody={textBody}
              textTitle={textHighlight}
              textPrimary={textPrimary}
            />

            {/* Card 4 */}
            <FeatureCard
              icon={User}
              title="Personal Library"
              description="Your own secure bookmark workspace, accessible from any device."
              textBody={textBody}
              textTitle={textHighlight}
              textPrimary={textPrimary}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper component for the feature cards
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  textBody,
  textTitle,
  textPrimary,
}) => (
  <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
    <Icon size={32} className={`${textPrimary} mb-3`} />
    <h3 className={`text-xl font-bold ${textTitle} mb-1`}>{title}</h3>
    <p className={`text-sm ${textBody}`}>{description}</p>
  </div>
);

export default Home;
