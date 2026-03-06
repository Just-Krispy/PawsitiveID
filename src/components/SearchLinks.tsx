"use client";

interface SearchLink {
  platform: string;
  url: string;
  icon: string;
  description: string;
}

interface SearchLinksProps {
  links: SearchLink[];
}

const platformColors: Record<string, string> = {
  fb: "from-blue-600 to-blue-700",
  cl: "from-purple-600 to-purple-700",
  nd: "from-green-600 to-green-700",
  pb: "from-cyan-600 to-cyan-700",
  pl: "from-teal-600 to-teal-700",
  pf: "from-indigo-600 to-indigo-700",
};

const platformIcons: Record<string, string> = {
  fb: "F",
  cl: "CL",
  nd: "N",
  pb: "PB",
  pl: "PL",
  pf: "PF",
};

export default function SearchLinks({ links }: SearchLinksProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold gradient-text mb-4">
        Search Other Platforms
      </h2>
      <p className="text-gray-400 text-sm mb-4">
        Click each link to search for matching lost pet reports. We&apos;ve pre-filled
        the search terms based on the AI analysis.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="match-card p-4 flex items-center gap-4 group"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                platformColors[link.icon] || "from-gray-600 to-gray-700"
              } flex items-center justify-center font-bold text-white text-sm shrink-0`}
            >
              {platformIcons[link.icon] || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white group-hover:text-orange-300 transition-colors">
                {link.platform}
              </h3>
              <p className="text-xs text-gray-400 truncate">
                {link.description}
              </p>
            </div>
            <svg
              className="w-5 h-5 text-gray-500 group-hover:text-orange-400 transition-colors shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
