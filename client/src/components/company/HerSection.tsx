// Separated Header/Hero Section to perfectly match the provided design layout
const CompanyHero = () => {
  // Main 3x3 Grid Companies using exact icon monograms instead of wide wordmarks
  const topCompanies = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' },
    { name: 'Microsoft', logo: 'data:image/webp;base64,UklGRpwCAABXRUJQVlA4IJACAACwHQCdASrbAOoAPp1Mnkm/pSMhLbNoA/ATiU3cLc4aeADQofYBVNdAB72f+Huu/MB/AP47+wHvCegDTAOmNAJFEPDLfdQHdv75CijJc++jU+s/CcQfUF4KsW4FRxY0bdL0ngOL7r/U2m0gjIGf/xy94ICkRkDP/45e8I9YUYi+rOFu053KfZj8+50IJc7lPsrJDd0Mg4cWwdr4IcNJl9i2wv4qa4uUsPhxbB22QkMO1TBVeFI2Y3dL6s4W7TrIunHUq7nQgl1kXTjqVdzoQS6yLpx1Ku50IJdZF046irJYXgAuueqb44kGIQ5LySxEN1GwEvFvcsAA/vqku7LRO+s3TKUAHoM8ovGwH5Nipz5ZPA+P+VzSffW8hXLJw8GGqRSYHdgga/vnzzAHjn/DNnHbyEIYWBJtXlnMfx+/YI1Cao7fcpTHYO3lTjEIWyHM9KgGNgFdQEblgE++o6S8hH/j86lOb1pMs1OhGxZAXIQnXhxrjaI/O3ysxJZ/UxtaX1AwjG8KqOFPf7qmcgtdqJwu6S9bd8QSW4yX1XhDp7SALkDVuvYJUxE3ARakglCsLUVdEZF6yaC8Q4USPRnmnt+kKGIwdpAzqfr9YHP6mRFeQmhumQGVDc64rHCUmdkuBapsE80Z6Z/JQFJbHiRhHitidKnS510tzEqcryIXibnES8dHwmcBRC5AsG8dPDaZ/Zty+70KrvUsqnAXSsyj21lRzaTPKv7XQKIMc+/H5EsMsPxO+kNtkL/IDrB1RdepgwiWx8hIsawnctvcDbFVISgRW7nFjdTFZKZvwj+JVREpE8coAbhmCJYm3aMuRQHPSDZoXVYSeaAVkN/kh8dvR9xgJ4gWKiGsnnOQD39eNoAAAA==' },

    { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
    { name: 'Amazon', logo: 'https://th.bing.com/th/id/OIP.dLl9UyA6y1GTydI-npnoygHaHv?w=175&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3' }, // Clean 'a' icon monogram
    { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', darkInvert: true },
    { name: 'Netflix', logo: 'https://th.bing.com/th/id/OIP.jBA0fAwgdtDhlcb9lBS66QHaEK?w=301&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3' }, // Clean 'N' icon monogram
    { name: 'Uber', logo: 'https://th.bing.com/th/id/OIP.h2_v21br6Yc6K4KvydB0BAHaHa?w=177&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', darkInvert: true },
    { name: 'Salesforce', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' },
    { name: 'Adobe', logo: 'https://th.bing.com/th/id/OIP.s2qnKGj8R9kTsbv6IANlEgHaIe?w=157&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3' }, // Clean 'A' icon monogram
  ];

  // Floating ambient background icons surrounding the grid
  const floatingIcons = [
    { logo: 'https://th.bing.com/th/id/OIP.statOl7nc1-CimhyoDPv2gHaEK?w=296&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', className: 'top-[20%] -left-12 h-6 w-6 opacity-30 dark:invert' },
    { logo: 'data:image/webp;base64,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', className: 'bottom-[25%] -left-16 h-5 w-auto opacity-30 dark:invert' },

    { logo: 'https://th.bing.com/th/id/OIP.fbrVBr63NNUHg84XIwK5yAHaH-?w=169&h=182&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', className: 'top-[35%] -left-4 h-6 w-6 text-[#ff5a5f] opacity-30' },
    { logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg', className: 'bottom-[35%] -right-10 h-6 w-6 opacity-20' },
    { logo: 'https://th.bing.com/th/id/OIP.QhOblVrVWMJV4RL8d75fIwHaEK?w=272&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', className: 'top-[40%] -right-12 h-5 w-5 opacity-20' },
  ];

  return (
    <div
      className="
        relative overflow-hidden
        rounded-[32px]
        border border-neutral-100/80
        bg-[#fdfcfb]
        p-8 md:p-14
        shadow-[0_4px_30px_rgba(0,0,0,0.02)]
        dark:border-neutral-800/60
        dark:bg-[#161616]
      "
    >
      {/* Soft ambient orange glow styling from the design background */}
      <div
        className="
          absolute -right-20 -top-20
          h-[450px] w-[450px] rounded-full
          bg-gradient-to-br from-[#fff2e0] via-[#fffbeb]/50 to-transparent
          blur-3xl pointer-events-none
          dark:from-[#2e210d] dark:via-[#1a150e]/30
        "
      />

      {/* Grid wrapper splits text layout and visual grid elements */}
      <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">

        {/* Left Column: Core Text Header Content */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Badge */}
          <div
            className="
              mb-5 self-start inline-flex items-center gap-1.5
              rounded-full
              bg-[#fff5eb]
              px-3.5 py-1.5
              text-xs font-semibold tracking-wide
              text-[#e08400]
              dark:bg-[#271b0c] dark:text-[#ffaa33]
            "
          >
            🚀 Company-wise Interview Preparation
          </div>

          {/* Main Typography Header Heading */}
          <h1
            className="
              max-w-xl
              text-[36px] font-bold
              leading-[1.18] tracking-tight
              text-[#111111]
              dark:text-white
              md:text-[44px]
            "
          >
            Practice Real Coding Questions Asked in Top Tech Companies
          </h1>

          {/* Section Description */}
          <p
            className="
              mt-5 max-w-xl
              text-[15px] leading-relaxed
              text-neutral-500/90
              dark:text-neutral-400
            "
          >
            Explore curated interview questions organized company-wise. Track your
            progress, solve frequently asked problems, and prepare smarter for
            technical interviews at companies like Google, Amazon, Meta,
            Microsoft, and more.
          </p>

          {/* Stats Indicators Containers */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {[
              { label: "Companies", value: "150+" },
              { label: "Questions", value: "3,000+" },
              { label: "Topics", value: "25+" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="
                  rounded-2xl
                  border border-neutral-200/50
                  bg-[#f8f9fa]/60
                  px-6 py-3.5 min-w-[15px]
                  dark:border-neutral-800/60
                  dark:bg-[#1f1f1f]/50
                "
              >
                <p className="text-[11px] font-medium tracking-wide text-neutral-400 dark:text-neutral-500">{stat.label}</p>
                <h3 className="mt-0.5 text-2xl font-bold tracking-tight text-neutral-800 dark:text-white">
                  {stat.value}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 3x3 Centralized Card Layout Grid */}
        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <div className="relative mr-15 w-full max-w-[370px]">

            {/* Ambient Background Decorative Floating Logotypes */}
            {floatingIcons.map((fIcon, fIdx) => (
              <img
                key={fIdx}
                src={fIcon.logo}
                alt=""
                className={`absolute  hidden md:block object-contain pointer-events-none select-none ${fIcon.className}`}
              />
            ))}

            {/* Standard 3x3 Card Grid Layer */}
            <div className="grid grid-cols-3 gap-4 w-full">
              {topCompanies.map((company, index) => (
                <div
                  key={index}
                  className="
                    flex flex-col items-center justify-center
                    aspect-square rounded-2xl p-4
                    bg-white border border-neutral-100
                    shadow-[0_10px_25px_-5px_rgba(0,0,0,0.025)]
                    dark:bg-[#1e1e1e] dark:border-neutral-800/80
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_-4px_rgba(0,0,0,0.06)]
                  "
                >
                  <div className="h-10 w-10 flex items-center justify-center">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className={`
                        max-h-[34px] max-w-[34px] object-contain
                        ${company.darkInvert ? 'dark:invert' : ''}
                      `}
                    />
                  </div>
                  <span className="mt-2.5 text-[11px] font-medium tracking-wide text-neutral-400 dark:text-neutral-500">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyHero;