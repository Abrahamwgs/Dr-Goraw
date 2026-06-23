/* =====================================================================
   publications.js — Shared portfolio data + publication search engine
   Exposes window.PORTFOLIO_DATA and initialises the publications UI.
   ===================================================================== */
(function () {
    "use strict";

    /* ---------------- DATA ---------------- */
    const RESEARCH_AREAS = [
        { icon: "≈", title: "Ecohydrology", desc: "Coupling water flow with ecosystem function across rivers, lakes and wetlands.", weight: 95 },
        { icon: "◌", title: "Water Quality", desc: "Monitoring nutrients, pollutants and limnological dynamics in freshwater systems.", weight: 92 },
        { icon: "❋", title: "Wetland Management", desc: "Conservation and restoration of critical wetland habitats and services.", weight: 85 },
        { icon: "⌬", title: "Watershed Analysis", desc: "Basin-scale assessment of hydrology, land use and sediment transport.", weight: 80 },
        { icon: "✚", title: "Environmental Health", desc: "Linking aquatic ecosystems to community and public health outcomes.", weight: 74 },
        { icon: "❂", title: "Climate Adaptation", desc: "Building water and ecosystem resilience to a changing climate.", weight: 78 },
        { icon: "◉", title: "Remote Sensing", desc: "Satellite and geospatial analysis of water bodies and vegetation.", weight: 70 },
        { icon: "∿", title: "Hydrological Modelling", desc: "Process-based modelling with SWAT, DUFLOW, PCLake+ and MARINA.", weight: 88 }
    ];

    const COUNTRIES = [
        { name: "Ethiopia", flag: "🇪🇹", type: "Home Base", lat: 9.15, lon: 40.49, kind: "collab" },
        { name: "Netherlands", flag: "🇳🇱", type: "Collaboration", lat: 52.13, lon: 5.29, kind: "collab" },
        { name: "Austria", flag: "🇦🇹", type: "Conference", lat: 47.52, lon: 14.55, kind: "conf" },
        { name: "Germany", flag: "🇩🇪", type: "Collaboration", lat: 51.17, lon: 10.45, kind: "collab" },
        { name: "Poland", flag: "🇵🇱", type: "Training", lat: 51.92, lon: 19.15, kind: "train" },
        { name: "South Africa", flag: "🇿🇦", type: "Conference", lat: -30.56, lon: 22.94, kind: "conf" },
        { name: "Kenya", flag: "🇰🇪", type: "Training", lat: -0.02, lon: 37.91, kind: "train" },
        { name: "USA", flag: "🇺🇸", type: "Conference", lat: 39.83, lon: -98.58, kind: "conf" },
        { name: "China", flag: "🇨🇳", type: "Collaboration", lat: 35.86, lon: 104.20, kind: "collab" }
    ];

    const PROJECTS = [
        {
            tag: "Flagship", title: "RS-4C Lake Tana Water Hyacinth Initiative",
            img: "assets/images/laketana-satellite.png",
            lead: "A remote-sensing and community-driven program to monitor, control and reverse the invasive water hyacinth threatening Lake Tana — Ethiopia's largest lake.",
            objectives: "Map hyacinth coverage via satellite, deploy early-warning indicators, and pilot integrated control strategies.",
            funding: "International research consortium · €120,000+",
            timeline: "2019 – 2024",
            results: "Basin-wide infestation maps, validated detection workflow and community monitoring network established.",
            impact: "Protecting fisheries, transport and the livelihoods of 500,000+ basin residents."
        },
        {
            tag: "Assessment", title: "Ecological Health Assessment of Lake Tana Basin",
            img: "assets/images/laketana-basin.png",
            lead: "Comprehensive limnological and ecological evaluation of the Lake Tana sub-basin, a UNESCO Biosphere Reserve.",
            objectives: "Characterise water quality, biodiversity and ecosystem stressors across seasons and sites.",
            funding: "Bahir Dar University & national partners",
            timeline: "2016 – 2021",
            results: "Baseline ecological indices, nutrient budgets and a basin health scorecard.",
            impact: "Informing regional conservation policy and sustainable basin management."
        },
        {
            tag: "Conservation", title: "Integrated Wetland Management Program",
            img: "assets/images/wetland.png",
            lead: "A multi-stakeholder program restoring degraded wetlands and embedding sustainable management practices.",
            objectives: "Restore hydrological function, conserve biodiversity and engage local communities.",
            funding: "Multi-donor environmental fund",
            timeline: "2018 – ongoing",
            results: "Restored wetland sites, community management plans and improved water retention.",
            impact: "Enhanced ecosystem services, carbon storage and climate resilience."
        },
        {
            tag: "International", title: "CAPAQUA East Africa Initiative",
            img: "assets/images/project-capaqua.svg",
            lead: "Capacity-building partnership advancing aquatic sciences and water-quality monitoring across East Africa.",
            objectives: "Train researchers, harmonise methods and strengthen regional monitoring networks.",
            funding: "International capacity-development grant · €100,000+",
            timeline: "2020 – 2025",
            results: "Trained cohorts of scientists, shared protocols and a regional aquatic data platform.",
            impact: "Lasting regional capacity for evidence-based water governance."
        },
        {
            tag: "Development", title: "Tana–Beles Water Resources Development Project",
            img: "assets/images/tana beles.jpg",
            lead: "Integrated assessment supporting sustainable water resources development in the Tana–Beles system.",
            objectives: "Evaluate water availability, inter-basin transfer impacts and ecological trade-offs.",
            funding: "National water development program",
            timeline: "2015 – 2020",
            results: "Hydrological assessments and recommendations balancing development with ecology.",
            impact: "Guiding sustainable energy, irrigation and ecosystem outcomes for the basin."
        }
    ];

    const SKILLS_RADAR = {
        labels: ["Leadership", "Env. Modelling", "Water Quality", "GIS", "Remote Sensing", "Data Science"],
        values: [95, 90, 93, 82, 80, 78]
    };

    const SKILL_TAGS = [
        "Leadership", "Environmental Modelling", "Water Quality Analysis", "GIS", "Remote Sensing",
        "Python", "SPSS", "SWAT", "DUFLOW", "PCLake+", "MARINA", "Excel", "KOBO Collect"
    ];

    const GALLERY = [
        { img: "assets/field%20images/photo_15_2026-06-24_00-04-27.jpg", cap: "Afro-alpine headwater monitoring" },
        { img: "assets/field%20images/photo_17_2026-06-24_00-04-27.jpg", cap: "Stream water-quality measurement" },
        { img: "assets/field%20images/photo_8_2026-06-24_00-04-27.jpg", cap: "River survey by boat" },
        { img: "assets/field%20images/photo_24_2026-06-24_00-04-27.jpg", cap: "Papyrus-fringed river sampling" },
        { img: "assets/field%20images/photo_26_2026-06-24_00-04-27.jpg", cap: "Team water-quality assessment" },
        { img: "assets/field%20images/photo_20_2026-06-24_00-04-27.jpg", cap: "Sediment-laden river monitoring" },
        { img: "assets/field%20images/photo_21_2026-06-24_00-04-27.jpg", cap: "In-stream water-quality profiling" },
        { img: "assets/field%20images/photo_18_2026-06-24_00-04-27.jpg", cap: "Field sampling & data recording" },
        { img: "assets/field%20images/photo_1_2026-06-24_00-04-26.jpg", cap: "Water microbiology laboratory" },
        { img: "assets/field%20images/new/photo_1_2026-06-24_01-58-06.jpg", cap: "Field research in progress" },
        { img: "assets/field%20images/new/photo_2_2026-06-24_01-58-06.jpg", cap: "Water sampling expedition" },
        { img: "assets/field%20images/new/photo_3_2026-06-24_01-58-06.jpg", cap: "Basin field work" },
        { img: "assets/field%20images/new/photo_4_2026-06-24_01-58-06.jpg", cap: "Ecosystem monitoring" },
        { img: "assets/field%20images/new/photo_5_2026-06-24_01-58-06.jpg", cap: "Research team in the field" },
        { img: "assets/field%20images/new/photo_6_2026-06-24_01-58-06.jpg", cap: "Water quality testing" },
        { img: "assets/field%20images/new/photo_7_2026-06-24_01-58-06.jpg", cap: "Environmental assessment" },
        { img: "assets/field%20images/new2/photo_10_2026-06-24_00-04-27.jpg", cap: "Field monitoring expedition" },
        { img: "assets/field%20images/new2/photo_11_2026-06-24_00-04-27.jpg", cap: "Water resources survey" },
        { img: "assets/field%20images/new2/photo_12_2026-06-24_00-04-27.jpg", cap: "Ecological assessment" },
        { img: "assets/field%20images/new2/photo_13_2026-06-24_00-04-27.jpg", cap: "Field data collection" },
        { img: "assets/field%20images/new2/photo_14_2026-06-24_00-04-27.jpg", cap: "Basin research activities" },
        { img: "assets/field%20images/new2/photo_16_2026-06-24_00-04-27.jpg", cap: "Water quality fieldwork" },
        { img: "assets/field%20images/new2/photo_19_2026-06-24_00-04-27.jpg", cap: "Environmental monitoring" },
        { img: "assets/field%20images/new2/photo_22_2026-06-24_00-04-27.jpg", cap: "Field research team" },
        { img: "assets/field%20images/new2/photo_23_2026-06-24_00-04-27.jpg", cap: "Water sampling work" },
        { img: "assets/field%20images/new2/photo_25_2026-06-24_00-04-27.jpg", cap: "Basin field survey" },
        { img: "assets/field%20images/new2/photo_27_2026-06-24_00-04-27.jpg", cap: "Ecological fieldwork" },
        { img: "assets/field%20images/new2/photo_2_2026-06-24_00-04-26.jpg", cap: "Research in the field" },
        { img: "assets/field%20images/new2/photo_3_2026-06-24_00-04-26.jpg", cap: "Water resources assessment" },
        { img: "assets/field%20images/new2/photo_4_2026-06-24_00-04-26.jpg", cap: "Field measurements" },
        { img: "assets/field%20images/new2/photo_5_2026-06-24_00-04-26.jpg", cap: "Environmental data collection" },
        { img: "assets/field%20images/new2/photo_6_2026-06-24_00-04-26.jpg", cap: "Field exploration" },
        { img: "assets/field%20images/new2/photo_7_2026-06-24_00-04-27.jpg", cap: "Water monitoring work" },
        { img: "assets/field%20images/new2/photo_9_2026-06-24_00-04-27.jpg", cap: "Research expedition" },
        { img: "assets/images/blue-nile-falls.png", cap: "Blue Nile Falls — Tis Abay" }
    ];

    /* Publication database — sourced from Google Scholar (verified profile) */
    const SCHOLAR_PROFILE = "https://scholar.google.com/citations?user=mFbPbVwAAAAJ&hl=en";
    const PUBLICATIONS = [
        { year: 2023, title: "Importance of spatial heterogeneity of nutrient loading on the ecological status of Lake Tana, Ethiopia", authors: "G. Goshu, M. Veenendaal, J. de Klein", venue: "Journal of Hydrology 623, 129815", cat: "Water Quality", cites: 17 },
        { year: 2023, title: "Ecological effect of a small dam on the macroinvertebrate assemblage and water quality of Koga River, Northwest Ethiopia", authors: "A. Gezie, G. Goshu, S. Tiku", venue: "Heliyon 9 (6)", cat: "Ecohydrology", cites: 21 },
        { year: 2021, title: "Performance of faecal indicator bacteria, microbial source tracking, and pollution risk mapping in tropical water", authors: "G. Goshu, A.A. Koelmans, J.J.M. de Klein", venue: "Environmental Pollution 276, 116693", cat: "Environmental Health", cites: 31 },
        { year: 2020, title: "Assessing seasonal nitrogen export to large tropical lakes", authors: "G. Goshu, M. Strokal, C. Kroeze, A.A. Koelmans, J.J.M. de Klein", venue: "Science of the Total Environment 731, 139199", cat: "Modelling", cites: 42 },
        { year: 2020, title: "Proximate composition of commercially important fish species in southern Gulf of Lake Tana, Ethiopia", authors: "H. Geremew, M. Abdisa, G. Goshu", venue: "Ethiopian Journal of Science and Technology 13 (1), 53-63", cat: "Aquatic Ecology", cites: 28 },
        { year: 2017, title: "Problem overview of the Lake Tana basin", authors: "G. Goshu, S. Aynalem", venue: "Social and Ecological System Dynamics (Springer)", cat: "Lake Tana Basin", cites: 109 },
        { year: 2017, title: "Social and Ecological System Dynamics: Characteristics, Trends, and Integration in the Lake Tana Basin, Ethiopia", authors: "K. Stave, G. Goshu, S. Aynalem (eds.)", venue: "Springer, 652 pp.", cat: "Lake Tana Basin", cites: 60 },
        { year: 2017, title: "Water quality of Lake Tana basin, Upper Blue Nile, Ethiopia: A review of available data", authors: "G. Goshu, A.A. Koelmans, J.J.M. de Klein", venue: "Social and Ecological System Dynamics (Springer)", cat: "Water Quality", cites: 56 },
        { year: 2017, title: "The fish and the fisheries of Lake Tana", authors: "A.A. Mengistu, C. Aragaw, M. Mengist, G. Goshu", venue: "Social and Ecological System Dynamics (Springer)", cat: "Aquatic Ecology", cites: 40 },
        { year: 2017, title: "Participatory system dynamics mapping for collaboration and socioecological integration in the Lake Tana region", authors: "K. Stave, B. Kopainsky, M. Anteneh, A.A. Mengistu, G. Goshu, et al.", venue: "Social and Ecological System Dynamics (Springer)", cat: "Lake Tana Basin", cites: 14 },
        { year: 2017, title: "Wetlands of the Lake Tana watershed", authors: "S. Aynalem, G. Goshu, A. Wondie", venue: "Social and Ecological System Dynamics (Springer)", cat: "Wetlands", cites: 11 },
        { year: 2014, title: "Bacterial quality of drinking water sources and antimicrobial resistance profile of Enterobacteriaceae in Bahir Dar city, Ethiopia", authors: "B. Abera, M. Kibret, G. Goshu, M. Yimer", venue: "Journal of Water, Sanitation and Hygiene for Development 4 (3), 384-390", cat: "Environmental Health", cites: 29 },
        { year: 2013, title: "Performance characteristics of qPCR assays targeting human- and ruminant-associated Bacteroidetes for microbial source tracking across sixteen countries", authors: "G.H. Reischer, J.E. Ebdon, ... G. Goshu, et al.", venue: "Environmental Science & Technology 47 (15), 8548-8556", cat: "Environmental Health", cites: 147 },
        { year: 2013, title: "Evaluation of watershed development plan and technology adoption level of farmers in Amhara Region: the case of SWHISA Project, Ethiopia", authors: "S. Addisu, G. Goshu, Y.G. Selassie, B. Tefera", venue: "Int. Journal of Scientific and Research Publications 3 (2), 1-11", cat: "Watershed", cites: 25 },
        { year: 2012, title: "Preliminary assessment of water hyacinth (Eichhornia crassipes) in Lake Tana", authors: "A. Wondie, A. Seid, E. Molla, G. Goshu, et al.", venue: "Proceedings, Biological Society of Ethiopia, Addis Ababa", cat: "Wetlands", cites: 24 },
        { year: 2011, title: "Water quality assessment of underground and surface water resources of Bahir Dar and peri-urban areas, north-west Ethiopia", authors: "G. Goshu, O.C. Akoma", venue: "Global Journal of Environmental Sciences 10 (1&2), 11-21", cat: "Water Quality", cites: 19 },
        { year: 2010, title: "A pilot study on anthropogenic faecal pollution impact in Bahir Dar Gulf of Lake Tana, Northern Ethiopia", authors: "G. Goshu, D. Byamukama, M. Manafi, A.K.T. Kirschner, A.H. Farnleitner", venue: "Ecohydrology & Hydrobiology 10 (2-4), 271-279", cat: "Environmental Health", cites: 46 },
        { year: 2010, title: "Spatial and temporal distribution of commercially important fish species of Lake Tana, Ethiopia", authors: "G. Goshu, D. Tewabe, B.T. Adugna", venue: "Ecohydrology & Hydrobiology 10 (2-4), 231-240", cat: "Aquatic Ecology", cites: 21 },
        { year: 2010, title: "Integrating aquaculture with traditional farming system: socioeconomic assessment in the Amhara Region, Ethiopia", authors: "B.T. Adugna, G. Goshu", venue: "Ecohydrology & Hydrobiology 10 (2-4), 223-230", cat: "Aquatic Ecology", cites: 14 },
        { year: 2007, title: "The physico-chemical characteristics of a highland crater lake and two reservoirs in north-west Amhara Region, Ethiopia", authors: "G. Goshu", venue: "Ethiopian Journal of Science and Technology 5 (1), 17-41", cat: "Water Quality", cites: 14 },

        { year: 2026, title: "Qualitative insights into the fish value chain: a case study of Sehala District, North Ethiopia", authors: "F. Taddese, G. Goshu, I. Hoeck", venue: "Fisheries and Aquatic Sciences 29 (4), 236-248", cat: "Aquatic Ecology" },
        { year: 2026, title: "Global pilot study: monitoring chemical pollution under low-capacity conditions", authors: "S. Finckh, A. Tewari, F. Kandie, ... G. Goshu, et al.", venue: "SETAC Europe 36th Annual Meeting", cat: "Environmental Health" },
        { year: 2025, title: "Modeling changes in nutrient retention ecosystem service using the InVEST-NDR model: a case study in the Gumara River of Lake Tana Basin, Ethiopia", authors: "W.B. Abebe, M.G. Dersseh, G. Goshu, W. Abera, et al.", venue: "Ecohydrology & Hydrobiology", cat: "Modelling" },
        { year: 2025, title: "Remote sensing approaches for water hyacinth and water quality monitoring: global trends, techniques, and applications", authors: "L.Y. Alemneh, D. Aklog, A. van Griensven, G. Goshu, S. Yalew, W.B. Abebe", venue: "Water 17 (17), 2573", cat: "Remote Sensing" },
        { year: 2025, title: "A review of reservoir sedimentation and water storage losses in the Ethiopian highlands", authors: "S. Asres, T. Taffese, Z. Firiew, L. Yihunie, G. Goshu", venue: "Discover Sustainability 6 (1), 1023", cat: "Watershed" },
        { year: 2025, title: "Recycling industrial sludge in low-cost construction: a sustainable approach using compressed stabilized earth blocks", authors: "L.Y. Alemneh, G.G. Yimer, Z.B. Ayele, T. Adgo, et al.", venue: "Water Practice and Technology", cat: "Environmental Health" },
        { year: 2024, title: "Reducing the emergence and spread of waterborne antimicrobial resistance (AMR) in Ethiopia from a One Health perspective", authors: "D.W. Graham, J. Mateo-Sagasta, A.T. Haile, A. Moodley, G. Goshu, M. Kibret", venue: "International Water Management Institute (IWMI), CGIAR One Health", cat: "Environmental Health" },
        { year: 2019, title: "Temporal and spatial phytoplankton biomass dynamics in southern Gulf of Lake Tana, north-western Ethiopia", authors: "D. Gashaye, G. Goshu, B. Abraha", venue: "International Journal of Aquatic Biology 7 (1), 1-8", cat: "Aquatic Ecology" },
        { year: 2017, title: "Research needs in the Lake Tana Basin social-ecological system", authors: "G. Goshu, S. Aynalem, B. Damtie, K. Stave", venue: "Social and Ecological System Dynamics (Springer)", cat: "Lake Tana Basin" },
        { year: 2017, title: "Waste management in Lake Tana basin — case of rapidly urbanizing Bahir Dar City", authors: "B. Abate, G. Goshu", venue: "Social and Ecological System Dynamics (Springer)", cat: "Environmental Health" },
        { year: 2014, title: "Variations in zooplankton diversity and abundance in five research fish ponds in north-west Amhara Region, Ethiopia", authors: "O.C. Akoma, G. Goshu, T.O.T. Imoobe", venue: "Ife Journal of Science 16 (1), 81-89", cat: "Aquatic Ecology" },
        { year: 2011, title: "Detection of toxigenic cyanobacteria in Bahir Dar Gulf of Lake Tana — a pilot study", authors: "I. Gagala, G. Goshu, K. Izydorczyk, T. Jurczak, et al.", venue: "Proceedings, pp. 287-300", cat: "Water Quality" },
        { year: 2010, title: "A preliminary survey of the ecohydrological management challenges faced by Lake Gudera, Sekela Woreda, West Gojjam, Ethiopia", authors: "M. Endalew, G. Goshu, W. Zelalem", venue: "Ecohydrology & Hydrobiology 10 (2-4), 325-331", cat: "Ecohydrology" },
        { year: 2010, title: "Status of Lake Tana commercial fishery, Ethiopia", authors: "D. Tewabe, G. Goshu", venue: "Management of shallow waterbodies for improved productivity", cat: "Aquatic Ecology" },
        { year: 2010, title: "The bacteriological quality of traditional hand-dug wells and protected hand pumps in Bahir Dar town and peri-urban areas, northern Ethiopia", authors: "G. Goshu, A. Farnleitner, M. Manafi, D. Byamukama", venue: "First National Research Symposium on Sustainable Development", cat: "Environmental Health" },
        { year: 2010, title: "Comparative study of physico-chemical characteristics of some on-farm research ponds, Ethiopia", authors: "G. Goshu, O.C. Akoma", venue: "Tropical Freshwater Biology 19 (1), 1", cat: "Water Quality" },
        { year: 2009, title: "Survey of a new constructed reservoir, Tekeze hydropower dam, Ethiopia", authors: "G. Goshu, T. Dereje, A. Chalachew", venue: "First Ethiopian Fisheries and Aquatic Science Association Proceedings", cat: "Aquatic Ecology" },
        { year: 2009, title: "A global assessment of the source specificity, sensitivity and geographical stability of Bacteroidetes qPCR assays for microbial source tracking", authors: "G. Reischer, J. Haider, N. Pokorny, ... G. Goshu, et al.", venue: "15th Health-Related Water Microbiology Symposium, 66-68", cat: "Environmental Health" },
        { year: 2009, title: "Comparing isolation media for C. perfringens spores and E. coli and establishing a consensus faecal pollution map in tropical waters of Ethiopia", authors: "G. Goshu, A.H. Farnleitner, M. Manafi, D. Byamukama", venue: "15th Health-Related Water Microbiology Symposium, 207-209", cat: "Environmental Health" },
        { year: 2008, title: "Evaluation of solar tent and drying rack methods for the production of quality dried fish in the Lake Tana area", authors: "A. Tessem, S. Demssie, G. Goshu, B. Bekele, et al.", venue: "Regional Conference on Completed Livestock Research Activities", cat: "Aquatic Ecology" },
        { year: 2007, title: "Evaluation of microbial faecal indicators and quantifying the respective level of pollution in ground and surface water of Bahir Dar and peri-urban areas, Ethiopia", authors: "G. Goshu", venue: "Bahir Dar University", cat: "Environmental Health" },
        { year: 2004, title: "Seasonal variation in plankton biomass, primary productivity and species composition of phytoplankton in Lake Tana", authors: "A. Wondie, G. Goshu", venue: "Bahir Dar Fisheries & Other Living Aquatic Resources — Research Progress Report", cat: "Aquatic Ecology" }
    ];

    /* ---- Further Education & Training ---- */
    const TRAININGS = [
        { title: "Erasmus+ Staff Mobility for Training", org: "BOKU University", country: "Austria", flag: "🇦🇹", badge: "Erasmus+", desc: "International staff-mobility exchange focused on advanced water and environmental science teaching and research methods at the University of Natural Resources and Life Sciences, Vienna." },
        { title: "Greenhouse Gas Measurement, Reporting & Verification", org: "ISO 14064 Programme", country: "International", flag: "🌍", badge: "ISO 14064", desc: "Certified training on GHG quantification, monitoring, reporting and verification aligned with the ISO 14064 standard for climate accountability." },
        { title: "Python Programming Fundamentals", org: "Professional Development", country: "International", flag: "🌍", badge: "Certified", desc: "Foundations of Python for scientific computing, data analysis and environmental model automation." },
        { title: "Macro Plastic Monitoring in the Nile Basin", org: "Nile Basin Initiative", country: "Ethiopia", flag: "🇪🇹", badge: "Field Training", desc: "Standardised protocols for macro-plastic pollution monitoring and assessment across the Nile Basin river systems." },
        { title: "Advanced GIS & Remote Sensing", org: "Professional Development", country: "International", flag: "🌍", badge: "Advanced", desc: "Geospatial analysis, satellite imagery interpretation and spatial modelling for water and land-use studies." },
        { title: "Project Proposal Development", org: "Capacity Building Program", country: "International", flag: "🌍", badge: "Certified", desc: "Designing competitive research proposals, logical frameworks and budgets for international grant calls." },
        { title: "Ecohydrology & Biotechnology for Sustainable IWRM", org: "UNESCO Programme", country: "International", flag: "🌍", badge: "UNESCO", desc: "Applying ecohydrological principles and biotechnology toward Integrated Water Resources Management." },
        { title: "Water, Sanitation and Hygiene (WASH)", org: "WASH Capacity Program", country: "Ethiopia", flag: "🇪🇹", badge: "WASH", desc: "Community water supply, sanitation and hygiene approaches for public and environmental health." },
        { title: "Strategic Planning & Management", org: "Leadership Development", country: "Ethiopia", flag: "🇪🇹", badge: "Leadership", desc: "Institutional strategy, organisational management and results-based planning for research leadership." },
        { title: "Agricultural Research Methodology", org: "Research Methods Program", country: "Ethiopia", flag: "🇪🇹", badge: "Methodology", desc: "Experimental design, data collection and statistical analysis for agricultural and environmental research." },
        { title: "Quantitative Microbial Source Tracking", org: "Advanced Laboratory Training", country: "International", flag: "🌍", badge: "Advanced", desc: "Molecular and quantitative methods for identifying and tracking microbial contamination sources in water." }
    ];

    /* ---- Courses & Trainings Offered (Teaching & Capacity Building) ---- */
    const TEACHING = [
        {
            category: "PhD Courses", icon: "🎓",
            courses: [
                { name: "Water and Waste Water Quality Modelling", note: "Process-based modelling of treatment and natural systems." },
                { name: "Advanced Ecohydrology", note: "Coupled hydrological–ecological processes at basin scale." },
                { name: "Aquatic & Wetland Ecosystems Modelling", note: "Dynamic modelling of lakes, rivers and wetlands." }
            ]
        },
        {
            category: "MSc & BSc Courses", icon: "📘",
            courses: [
                { name: "Advanced Water Quality Management", note: "Nutrients, pollutants and management strategies." },
                { name: "Water Quality Management", note: "Monitoring frameworks and standards." },
                { name: "Aquatic Ecology", note: "Structure and function of freshwater ecosystems." },
                { name: "Wetland Management", note: "Conservation, restoration and ecosystem services." },
                { name: "Environmental Pollution & Management", note: "Sources, impacts and mitigation." },
                { name: "Introduction to Ecology & Environment", note: "Foundational ecological principles." },
                { name: "Advanced Limnology", note: "Physical, chemical and biological limnology." }
            ]
        },
        {
            category: "Professional Trainings", icon: "🛠️",
            courses: [
                { name: "Hydrological Modelling", note: "SWAT and process-based catchment modelling." },
                { name: "Water Quality Modelling", note: "DUFLOW, PCLake+ and MARINA applications." },
                { name: "Watershed Monitoring", note: "Field monitoring networks and protocols." },
                { name: "Basic Water Quality Testing", note: "Practical field and laboratory methods." }
            ]
        },
        {
            category: "Regional Capacity Building", icon: "🌍",
            courses: [
                { name: "Water Hyacinth Management Training", note: "Detection, control and community engagement for Lake Tana." }
            ]
        }
    ];

    const TEACHING_STATS = [
        { num: 13, suffix: "+", label: "Students Supervised" },
        { num: 20, suffix: "+", label: "Courses Delivered" },
        { num: 4, suffix: "", label: "Academic Levels" },
        { num: 500, suffix: "+", label: "Trainees Reached" }
    ];

    /* ---- Personal Skills & Competences (executive) ---- */
    const COMPETENCES = [
        { group: "Leadership", icon: "◈", items: ["Institutional Leadership", "Strategic Planning", "Program Management", "Team Coordination"] },
        { group: "Communication", icon: "✸", items: ["International Conference Speaking", "Stakeholder Engagement", "Negotiation", "Scientific Communication"] },
        { group: "Research", icon: "⌬", items: ["Research Supervision", "Scientific Collaboration", "Proposal Writing", "Resource Mobilization"] },
        { group: "Professional Excellence", icon: "★", items: ["Problem Solving", "Analytical Thinking", "Quality Assurance", "Community Impact"] }
    ];

    const COMPETENCE_RADAR = {
        labels: ["Leadership", "Communication", "Research", "Strategy", "Collaboration", "Innovation"],
        values: [96, 92, 95, 90, 93, 88]
    };

    const LANGUAGES = [
        { name: "English", flag: "🇬🇧", levels: { Speaking: "Fluent", Reading: "Excellent", Writing: "Excellent", Listening: "Excellent" }, score: 95 },
        { name: "Amharic", flag: "🇪🇹", levels: { Speaking: "Fluent", Reading: "Excellent", Writing: "Excellent", Listening: "Excellent" }, score: 100 }
    ];

    /* ---- Skills & Competencies (expertise meters) ---- */
    const EXPERTISE = [
        {
            group: "Water Resources", icon: "≈",
            items: [
                { name: "Integrated Water Resources Management", level: 95 },
                { name: "Watershed Management", level: 92 },
                { name: "Water Quality Assessment", level: 96 },
                { name: "Water Quality Modelling", level: 90 }
            ]
        },
        {
            group: "Environmental Science", icon: "❂",
            items: [
                { name: "Environmental Management", level: 93 },
                { name: "Ecosystem Health Assessment", level: 91 },
                { name: "Wetland Conservation", level: 89 },
                { name: "Climate Resilience", level: 87 }
            ]
        },
        {
            group: "Research & Academia", icon: "🎓",
            items: [
                { name: "PhD Supervision", level: 88 },
                { name: "MSc Supervision", level: 94 },
                { name: "Curriculum Development", level: 86 },
                { name: "Scientific Publishing", level: 92 }
            ]
        },
        {
            group: "Program Management", icon: "◈",
            items: [
                { name: "International Partnerships", level: 93 },
                { name: "Consortium Management", level: 88 },
                { name: "Grant Acquisition", level: 90 },
                { name: "Project Coordination", level: 92 }
            ]
        },
        {
            group: "Engagement & Events", icon: "✸",
            items: [
                { name: "Event Management", level: 85 },
                { name: "International Workshops", level: 90 },
                { name: "Policy Dialogues", level: 87 },
                { name: "High-Level Government Engagement", level: 86 },
                { name: "Stakeholder Consultation", level: 91 }
            ]
        }
    ];

    /* ---- Specialized Software & Technical Tools ---- */
    const TECH_STACK = [
        {
            group: "Water & Environmental Modelling", icon: "∿",
            tools: [
                { name: "SWAT", level: 92 }, { name: "DUFLOW", level: 88 },
                { name: "PCLake+", level: 90 }, { name: "MARINA", level: 86 }
            ]
        },
        {
            group: "GIS & Remote Sensing", icon: "◉",
            tools: [
                { name: "GIS Applications", level: 88 }, { name: "Remote Sensing Analysis", level: 85 },
                { name: "Environmental Monitoring Systems", level: 83 }
            ]
        },
        {
            group: "Data Analysis", icon: "▤",
            tools: [
                { name: "Python", level: 80 }, { name: "SPSS", level: 88 },
                { name: "Microsoft Excel", level: 95 }, { name: "Statistical Analysis", level: 90 }
            ]
        },
        {
            group: "Field & Research Tools", icon: "⌖",
            tools: [
                { name: "KOBO Collect", level: 90 }, { name: "Water Quality Monitoring Systems", level: 92 },
                { name: "Environmental Assessment Tools", level: 89 }
            ]
        }
    ];

    /* Expose data globally for other modules */
    window.PORTFOLIO_DATA = {
        RESEARCH_AREAS, COUNTRIES, PROJECTS, SKILLS_RADAR, SKILL_TAGS, GALLERY, PUBLICATIONS, SCHOLAR_PROFILE,
        TRAININGS, TEACHING, TEACHING_STATS, COMPETENCES, COMPETENCE_RADAR, LANGUAGES, EXPERTISE, TECH_STACK
    };

    /* ---------------- PUBLICATIONS UI ---------------- */
    function initPublications() {
        const listEl = document.getElementById("pubList");
        const searchEl = document.getElementById("pubSearch");
        const filtersEl = document.getElementById("pubFilters");
        const emptyEl = document.getElementById("pubEmpty");
        if (!listEl) return;

        const categories = ["All", ...Array.from(new Set(PUBLICATIONS.map(p => p.cat)))];
        let activeCat = "All";
        let query = "";

        // Build filter buttons
        filtersEl.innerHTML = categories.map((c, i) =>
            `<button class="pub__filter${i === 0 ? " is-active" : ""}" data-cat="${c}" role="tab">${c}</button>`
        ).join("");

        function render() {
            const q = query.trim().toLowerCase();
            const filtered = PUBLICATIONS
                .filter(p => activeCat === "All" || p.cat === activeCat)
                .filter(p => !q || (p.title + p.authors + p.venue + p.cat + p.year).toLowerCase().includes(q))
                .sort((a, b) => b.year - a.year);

            emptyEl.hidden = filtered.length !== 0;

            listEl.innerHTML = filtered.map((p, idx) => {
                const search = "https://scholar.google.com/scholar?q=" + encodeURIComponent(p.title);
                const cites = (p.cites || 0) > 0
                    ? `<span class="pub-card__cites" title="Citations (Google Scholar)">${p.cites} citations</span>` : "";
                return `
                <article class="pub-card" style="animation: revealUp 0.6s var(--ease) ${idx * 0.04}s both;">
                    <span class="pub-card__year">${p.year}</span>
                    <div class="pub-card__main">
                        <h3 class="pub-card__title">${p.title}</h3>
                        <p class="pub-card__meta">${p.authors} · <em>${p.venue}</em></p>
                        <span class="pub-card__tags"><span class="pub-card__cat">${p.cat}</span>${cites}</span>
                    </div>
                    <a class="pub-card__doi" href="${search}" target="_blank" rel="noopener" data-cursor="link">View ↗</a>
                </article>`;
            }).join("");

            // Re-register magnetic/cursor hooks for new nodes
            if (window.refreshCursorTargets) window.refreshCursorTargets();
        }

        filtersEl.addEventListener("click", (e) => {
            const btn = e.target.closest(".pub__filter");
            if (!btn) return;
            activeCat = btn.dataset.cat;
            filtersEl.querySelectorAll(".pub__filter").forEach(b => b.classList.toggle("is-active", b === btn));
            render();
        });

        let t;
        searchEl.addEventListener("input", (e) => {
            clearTimeout(t);
            query = e.target.value;
            t = setTimeout(render, 120);
        });

        render();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPublications);
    } else {
        initPublications();
    }
})();
