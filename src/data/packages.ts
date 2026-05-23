export interface TravelPackage {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  price: number;
  currency: string;
  duration: string;
  destination: string;
  style: string;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  image: string;
  images: string[];
  itinerary: { day: number; title: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
}

export interface Destination {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  details: string;
  highlights: string[];
  image: string;
  packageCount: number;
}

export const packages: TravelPackage[] = [
  {
    id: "1",
    title: "Classic Western Tour",
    company: "Dragon Adventures",
    price: 2500,
    currency: "USD",
    duration: "7 Days / 6 Nights",
    destination: "Paro, Thimphu, Punakha",
    style: "Cultural",
    rating: 4.9,
    reviewCount: 124,
    description: "The most popular route covering the primary sights of Bhutan. This comprehensive tour takes you through the western valleys, showcasing Bhutan's most iconic monasteries, dzongs, and natural wonders.",
    shortDescription: "Explore Bhutan's iconic monasteries, dzongs, and valleys on this 7-day cultural journey.",
    image: "",
    images: [],
    itinerary: [
      { day: 1, title: "Arrival in Paro", description: "Arrive at Paro International Airport. Transfer to hotel. Evening visit to Paro Rinpung Dzong and explore the town." },
      { day: 2, title: "Tiger's Nest Hike", description: "Full day hike to the iconic Taktsang Monastery (Tiger's Nest). Afternoon visit to Kyichu Lhakhang, one of Bhutan's oldest temples." },
      { day: 3, title: "Paro to Thimphu", description: "Drive to Thimphu, the capital city. Visit the National Memorial Chorten, Buddha Dordenma statue, and Tashichho Dzong." },
      { day: 4, title: "Thimphu Exploration", description: "Explore Thimphu's highlights including the Folk Heritage Museum, National Library, and the bustling weekend market." },
      { day: 5, title: "Thimphu to Punakha", description: "Cross the spectacular Dochula Pass with its 108 memorial chortens. Visit Punakha Dzong and Chimi Lhakhang (Fertility Temple)." },
      { day: 6, title: "Punakha Valley", description: "Explore Punakha valley, visit local villages, and enjoy a nature walk along the Mo Chhu river. Optional hike to Khamsum Yulley Namgyal Chorten." },
      { day: 7, title: "Departure", description: "Drive back to Paro for departure. Optional morning visit to Drukgyel Dzong ruins." },
    ],
    inclusions: ["All accommodation in 3-star hotels", "Daily meals (breakfast, lunch, dinner)", "Licensed English-speaking guide", "Internal transport", "Monument fees", "SDF fee included"],
    exclusions: ["International flights", "Travel insurance", "Personal expenses", "Tips and gratuities"],
    highlights: ["Tiger's Nest Monastery hike", "Punakha Dzong", "Dochula Pass", "Tashichho Dzong", "Buddha Dordenma"],
  },

  {
    id: "2",
    title: "Luxury & Wellness Retreat",
    company: "Himalayan Escapes",
    price: 5000,
    currency: "USD",
    duration: "10 Days / 9 Nights",
    destination: "Paro, Thimphu, Punakha, Phobjikha",
    style: "Luxury",
    rating: 5.0,
    reviewCount: 67,
    description: "Indulge in the finest Bhutan has to offer with stays at premium lodges like Six Senses, Aman, or Como. This luxury retreat combines world-class hospitality with private cultural experiences, yoga sessions, and exclusive access to sacred sites.",
    shortDescription: "Premium lodges, private experiences, yoga, and exclusive access to Bhutan's sacred sites.",
    image: "",
    images: [],
    itinerary: [
      { day: 1, title: "Luxury Arrival in Paro", description: "Private airport transfer. Check into luxury lodge. Welcome dinner with traditional Bhutanese cuisine." },
      { day: 2, title: "Private Tiger's Nest Experience", description: "Early morning private guided hike to Tiger's Nest Monastery. Picnic lunch with valley views. Evening spa treatment." },
      { day: 3, title: "Paro Heritage & Wellness", description: "Private museum tour at Ta Dzong. Traditional hot stone bath. Farm-to-table dinner at the lodge." },
      { day: 4, title: "Thimphu Cultural Immersion", description: "Private visit to Tashichho Dzong. Meet local artisans. Yoga session overlooking the valley." },
      { day: 5, title: "Thimphu Arts & Wellness", description: "Visit Royal Textile Academy. Private cooking class with a local chef. Meditation session." },
      { day: 6, title: "Journey to Punakha", description: "Scenic drive to Punakha with private stops. Visit Punakha Dzong. Wellness activities at the lodge." },
      { day: 7, title: "Punakha Valley Exploration", description: "Private hike to Khamsum Yulley Namgyal Chorten. Visit Chimi Lhakhang. Spa afternoon." },
      { day: 8, title: "Phobjikha Valley", description: "Drive to Phobjikha Valley. Visit Gangtey Monastery. Black-necked crane viewing. Luxury lodge stay." },
      { day: 9, title: "Phobjikha Nature & Farewell", description: "Nature walk in the valley. Private Buddhist teaching session. Farewell dinner." },
      { day: 10, title: "Departure", description: "Scenic drive back to Paro. Private departure transfer." },
    ],
    inclusions: ["5-star luxury lodges (Six Senses, Aman, or Como)", "All gourmet meals with local specialties", "Private guide and driver", "Luxury transport", "Spa treatments and wellness activities", "All monument fees", "Private cultural experiences", "SDF included"],
    exclusions: ["International flights", "Travel insurance", "Personal shopping", "Premium spa add-ons"],
    highlights: ["Private Tiger's Nest hike", "Luxury lodge stays", "Yoga and wellness sessions", "Phobjikha Valley", "Private cultural experiences"],
  },
  {
    id: "3",
    title: "Druk Path Trek",
    company: "Thunder Dragon Treks",
    price: 1950,
    currency: "USD",
    duration: "8 Days / 7 Nights",
    destination: "Paro, Druk Path Trail",
    style: "Adventure",
    rating: 4.7,
    reviewCount: 89,
    description: "One of Bhutan's most popular trekking routes, the Druk Path Trek offers stunning Himalayan views, pristine forests, and cultural immersion. This 4-day trek takes you through remote villages and high mountain passes.",
    shortDescription: "Trek through pristine Himalayan trails, remote villages, and high mountain passes.",
    image: "",
    images: [],
    itinerary: [
      { day: 1, title: "Paro Arrival & Acclimatization", description: "Arrive in Paro. Equipment check and briefing. Short acclimatization walk in Paro valley." },
      { day: 2, title: "Start Druk Path Trek", description: "Drive to trailhead. Begin trek to Jele Dzong campsite (3,400m). Pass through blue pine forests." },
      { day: 3, title: "Mountain Lakes & Passes", description: "Trek past sacred lakes and cross high ridges. Camp at Jimilangtso (3,740m) with panoramic Himalayan views." },
      { day: 4, title: "High Altitude Crossing", description: "Cross the highest point of the trek (4,200m). Descend through rhododendron forests to Jangchulakha." },
      { day: 5, title: "Descent to Thimphu", description: "Continue descent to Thimphu valley. Visit Tashichho Dzong and weekend market." },
      { day: 6, title: "Thimphu Exploration", description: "Full day exploring Thimphu - Buddha Dordenma, National Memorial Chorten, and Takin Zoo." },
      { day: 7, title: "Drive to Paro", description: "Scenic drive back to Paro. Visit Drukgyel Dzong ruins and National Museum." },
      { day: 8, title: "Departure", description: "Transfer to airport for departure flight." },
    ],
    inclusions: ["Camping equipment and tents", "All meals during trek", "Licensed trekking guide and porters", "Internal transport", "Permits and fees", "SDF included"],
    exclusions: ["Personal trekking gear", "International flights", "Travel insurance", "Personal expenses", "Tips"],
    highlights: ["Druk Path Trek", "Himalayan mountain views", "Sacred mountain lakes", "Thimphu city exploration"],
  },
  {
    id: "4",
    title: "In-Depth Cultural Tour",
    company: "Bhutan Bliss Tours",
    price: 4200,
    currency: "USD",
    duration: "13 Days / 12 Nights",
    destination: "Kathmandu, Paro, Thimphu, Punakha, Phobjikha, Bumthang",
    style: "Cultural",
    rating: 4.8,
    reviewCount: 156,
    description: "A comprehensive cultural journey combining sightseeing with Bhutanese festivals (Tshechus). Explore the spiritual heartland of Bumthang, witness masked dances, and experience fire blessings in this deeply immersive 13-day tour.",
    shortDescription: "Combine sightseeing with Tshechus (festivals), explore Bumthang Valley, and experience fire blessings.",
    image: "",
    images: [],
    itinerary: [
      { day: 1, title: "Kathmandu Transit", description: "Arrive in Kathmandu, Nepal. Cultural orientation and rest. Optional sightseeing in Kathmandu." },
      { day: 2, title: "Fly to Paro", description: "Morning flight to Paro, Bhutan. Scenic mountain views during approach. Transfer to Thimphu." },
      { day: 3, title: "Thimphu Introduction", description: "Explore Thimphu - Tashichho Dzong, Buddha Dordenma, National Memorial Chorten, and weekend market." },
      { day: 4, title: "Thimphu Tsechu Festival", description: "Attend Thimphu Tsechu festival with traditional masked dances and religious ceremonies." },
      { day: 5, title: "Thimphu to Punakha", description: "Drive to Punakha via Dochula Pass. Visit Punakha Dzong and Chimi Lhakhang." },
      { day: 6, title: "Punakha Exploration", description: "Explore Punakha valley, visit local villages, and hike to Khamsum Yulley Namgyal Chorten." },
      { day: 7, title: "Punakha to Phobjikha", description: "Drive to Phobjikha Valley (Gangtey). Visit Gangtey Monastery and observe black-necked cranes." },
      { day: 8, title: "Phobjikha Nature", description: "Nature walks in Phobjikha Valley. Visit crane information center and local villages." },
      { day: 9, title: "Journey to Bumthang", description: "Drive to Bumthang, the spiritual heartland. Cross Pele La Pass." },
      { day: 10, title: "Bumthang Temples", description: "Explore Bumthang's ancient temples: Jambay Lhakhang, Kurjey Lhakhang, and Tamshing Monastery." },
      { day: 11, title: "Bumthang Culture", description: "Visit Jakar Dzong, experience local weaving traditions, and enjoy Bumthang's unique culture." },
      { day: 12, title: "Return to Paro", description: "Drive back to Paro. Visit Drukgyel Dzong and National Museum." },
      { day: 13, title: "Departure", description: "Transfer to airport for departure flight." },
    ],
    inclusions: ["All accommodation", "Daily meals", "Licensed guide", "Internal transport", "Festival access", "Monument fees", "SDF included"],
    exclusions: ["International flights", "Travel insurance", "Personal expenses", "Tips"],
    highlights: ["Thimphu Tsechu Festival", "Bumthang Valley temples", "Phobjikha Valley", "Punakha Dzong", "Fire blessings"],
  },
  {
    id: "5",
    title: "Eastern Bhutan Explorer",
    company: "Dragon Adventures",
    price: 3200,
    currency: "USD",
    duration: "12 Days / 11 Nights",
    destination: "Paro, Bumthang, Mongar, Trashigang",
    style: "Adventure",
    rating: 4.6,
    reviewCount: 42,
    description: "Venture into the rarely visited eastern regions of Bhutan. This expedition takes you through dramatic gorges, ancient temples, and villages where traditional life remains unchanged for centuries. Experience the raw beauty of eastern Bhutan.",
    shortDescription: "Venture into Bhutan's rarely visited eastern regions and ancient villages.",
    image: "",
    images: [],
    itinerary: [
      { day: 1, title: "Paro Welcome", description: "Arrival at Paro International Airport. Transfer to hotel. Evening orientation." },
      { day: 2, title: "Paro Highlights", description: "Visit Tiger's Nest Monastery and Paro Rinpung Dzong. Explore Paro town." },
      { day: 3, title: "Journey to Bumthang", description: "Scenic drive through central Bhutan, crossing Pele La Pass. Arrive in Bumthang." },
      { day: 4, title: "Bumthang Temples", description: "Explore ancient temples: Jambay Lhakhang (7th century), Kurjey Lhakhang, and Jakar Dzong." },
      { day: 5, title: "Bumthang Culture", description: "Visit Tamshing Monastery, experience local weaving, and explore Bumthang's spiritual sites." },
      { day: 6, title: "To Mongar", description: "Drive to Mongar, crossing Thrumshingla Pass (3,754m) with stunning eastern Himalayan views." },
      { day: 7, title: "Mongar Exploration", description: "Visit Mongar Dzong. Explore local villages and traditional weaving communities." },
      { day: 8, title: "To Trashigang", description: "Drive to Trashigang, Bhutan's largest eastern town. Visit Trashigang Dzong." },
      { day: 9, title: "Trashigang Culture", description: "Explore Trashigang and surrounding villages. Meet local artisans and weavers." },
      { day: 10, title: "Rangjung Monastery", description: "Visit Rangjung Woesel Choeling Monastery and experience eastern Bhutanese culture." },
      { day: 11, title: "Return Journey", description: "Begin return journey to Paro with scenic drives through gorges and valleys." },
      { day: 12, title: "Departure", description: "Arrive in Paro. Transfer to airport for departure." },
    ],
    inclusions: ["All accommodation", "Daily meals", "Licensed guide", "Internal transport", "Monument fees", "Permits", "SDF included"],
    exclusions: ["International flights", "Travel insurance", "Personal expenses", "Tips"],
    highlights: ["Eastern villages", "Thrumshingla Pass", "Bumthang temples", "Trashigang Dzong", "Traditional weaving"],
  },
  {
    id: "6",
    title: "Bhutan Festival Special",
    company: "Bhutan Bliss Tours",
    price: 2800,
    currency: "USD",
    duration: "6 Days / 5 Nights",
    destination: "Paro, Thimphu",
    style: "Cultural",
    rating: 4.9,
    reviewCount: 98,
    description: "Time your visit with one of Bhutan's spectacular Tshechu festivals. Witness colorful masked dances, religious ceremonies, and join locals in celebration. Experience the spiritual and cultural heart of Bhutanese festivals.",
    shortDescription: "Witness spectacular Tshechu festivals with masked dances and ancient ceremonies.",
    image: "",
    images: [],
    itinerary: [
      { day: 1, title: "Festival Arrival", description: "Arrive in Paro. Transfer to Thimphu. Evening cultural briefing about the festival." },
      { day: 2, title: "Festival Day 1", description: "Full day at Tshechu festival. Witness traditional masked dances and religious ceremonies." },
      { day: 3, title: "Festival Day 2", description: "Continue festival experience. Sacred unfurling of the Thongdrel (giant scroll painting)." },
      { day: 4, title: "Tiger's Nest Hike", description: "Morning hike to Taktsang Monastery. Afternoon free time or optional activities." },
      { day: 5, title: "Thimphu Exploration", description: "Explore Thimphu highlights: Buddha Dordenma, National Memorial Chorten, and weekend market." },
      { day: 6, title: "Departure", description: "Transfer to Paro airport for departure flight." },
    ],
    inclusions: ["Festival access and seating", "All accommodation", "Daily meals", "Licensed guide", "Internal transport", "Monument fees", "SDF included"],
    exclusions: ["International flights", "Travel insurance", "Personal expenses", "Souvenirs"],
    highlights: ["Tshechu Festival", "Masked dances", "Thongdrel unfurling", "Tiger's Nest Monastery"],
  },
];

export const destinations: Destination[] = [
  {
    id: "paro",
    name: "Paro Valley",
    subtitle: "Gateway to Bhutan",
    description: "The gateway to Bhutan featuring the iconic Tiger's Nest Monastery perched on a 900m cliff.",
    details: "Paro Valley is the kingdom’s most visited region, with highlights like Taktsang Monastery, the National Museum at Ta Dzong, Rinpung Dzong, and the ruins of Drukgyel Dzong. The valley also hosts Bhutan's only international airport, making it the first stop for most visitors.",
    highlights: ["Tiger's Nest Monastery", "National Museum (Ta Dzong)", "Rinpung Dzong", "Drukgyel Dzong"],
    image: "",
    packageCount: 6,
  },
  {
    id: "thimphu",
    name: "Thimphu",
    subtitle: "Bhutan's capital city",
    description: "Bhutan's vibrant capital blending modern life with ancient traditions.",
    details: "Thimphu offers iconic landmarks such as Tashichho Dzong, Buddha Dordenma, and the National Memorial Chorten. The city also features local markets, craft bazaars, and cultural institutions like the Folk Heritage Museum and Royal Textile Academy.",
    highlights: ["Buddha Dordenma", "Tashichho Dzong", "National Memorial Chorten", "Weekend Market"],
    image: "",
    packageCount: 5,
  },
  {
    id: "punakha",
    name: "Punakha",
    subtitle: "Historic river valley",
    description: "The old winter capital known for its beautiful dzong at the meeting of two rivers.",
    details: "Punakha is home to Punakha Dzong, often called the most beautiful dzong in Bhutan, and the fertility temple Chimi Lhakhang. Nearby Dochula Pass offers 108 memorial chortens with Himalayan views, while Khamsum Yulley Namgyal Chorten sits above terraced rice fields.",
    highlights: ["Punakha Dzong", "Chimi Lhakhang", "Dochula Pass", "Khamsum Yulley Namgyal Chorten"],
    image: "",
    packageCount: 3,
  },
  {
    id: "bumthang",
    name: "Bumthang Valley",
    subtitle: "Bhutan's spiritual heart",
    description: "The spiritual heartland of Bhutan, home to ancient temples and sacred sites.",
    details: "Bumthang Valley contains some of Bhutan's oldest temples, including Jambay Lhakhang and Kurjey Lhakhang. It is also famous for the 'Burning Lake' legend, traditional weaving, and rich local culture in its rural villages.",
    highlights: ["Jambay Lhakhang", "Kurjey Lhakhang", "Burning Lake", "Traditional weaving"],
    image: "",
    packageCount: 2,
  },
  {
    id: "phobjikha",
    name: "Phobjikha Valley",
    subtitle: "Crane valley",
    description: "A pristine glacial valley and winter home to endangered Black-Necked Cranes.",
    details: "Phobjikha Valley is a peaceful nature retreat centered around Gangtey Monastery. The valley is famous for the Black-Necked Cranes that arrive each winter and offers easy nature walks through meadows and pine forests.",
    highlights: ["Gangtey Monastery", "Black-Necked Cranes", "Nature walks", "Cultural homestays"],
    image: "",
    packageCount: 2,
  },
  {
    id: "haa",
    name: "Haa Valley",
    subtitle: "Off-the-beaten-path",
    description: "A remote valley near the Tibetan border, offering pristine village life and mountain views.",
    details: "Haa Valley is one of Bhutan's least visited regions, known for traditional village life, ancient temples, and the scenic Chele La pass. It provides a quiet mountain escape and a contrast to the busier western valleys.",
    highlights: ["Chele La Pass", "Traditional villages", "Haa Lhakhang", "Mountain scenery"],
    image: "",
    packageCount: 1,
  },
];

export interface Company {
  id: string;
  name: string;
  tagline: string;
  email: string;
  whatsapp?: string;
  phone?: string;
  altPhone?: string;
  licenseNo?: string;
  yearLicensed?: string;
  location?: string;
  website: string;
  source: string;
  note?: string;
}

export const companies: Company[] = [
  {
    id: "amedewa",
    name: "Amedewa Tours",
    tagline: "Cultural & spiritual journeys",
    email: "travelamedewa@gmail.com / seo.amedewa@gmail.com",
    whatsapp: "+975-17306726",
    altPhone: "+61 466 355 449",
    website: "https://www.amedewa.com",
    source: "Company listings",
  },
  {
    id: "bhutan-pelyab",
    name: "Bhutan Pelyab Tours & Treks",
    tagline: "Trekking & adventure expeditions",
    email: "info@bhutanpelyabtours.com",
    whatsapp: "+975 1795 2136",
    website: "https://bhutanpelyabtours.com",
    source: "Company website & LinkedIn",
  },
  {
    id: "bhutan-swallowtail",
    name: "Bhutan Swallowtail",
    tagline: "Luxury bespoke travel",
    email: "Not publicly listed — requires website inquiry form",
    website: "https://www.bhutanswallowtail.com",
    source: "World Travel Awards nominee (booking requires web form)",
    note: "Bhutan Swallowtail specializes in high-end bespoke travel. For luxury bookings, please use the contact form on their website as direct contact details are not publicly listed.",
  },
  {
    id: "bhutan-travel-center",
    name: "Bhutan Travel Center",
    tagline: "All-rounder, popular with international tourists",
    email: "info@bhutantravelcenter.com / bhutantravelcenter@gmail.com",
    whatsapp: "+975 17775309",
    phone: "+975 2 336702",
    altPhone: "+975 77729299",
    licenseNo: "1042764",
    yearLicensed: "2019",
    website: "https://www.bhutantravelcenter.com",
    source: "Bhutan Tourism Services Portal & company site",
    note: "Government Verified: This company is officially licensed by the Tourism Council of Bhutan with License No. 1042764.",
  },
  {
    id: "bhutan-travel-guru",
    name: "Bhutan Travel Guru",
    tagline: "Customized, flexible itineraries",
    email: "Not available in search results",
    website: "Search in progress — requires further lookup",
    source: "Direct contact information for Bhutan Travel Guru was not found in this search.",
    note: "Direct contact information for Bhutan Travel Guru was not found in this search. The company appears to require website contact forms for booking inquiries.",
  },
  {
    id: "go-bhutan-tours",
    name: "Go Bhutan Tours",
    tagline: "Budget to mid-range",
    email: "Available via website contact form only",
    website: "https://www.gobhutantours.com",
    source: "Company 'About Us' page",
    note: "Go Bhutan Tours specializes in personalized service. Director Mrs. Hana Nguyen runs the company. Use the contact form or chat widget on their website for inquiries.",
  },
  {
    id: "windhorse-tours",
    name: "Windhorse Tours",
    tagline: "One of Bhutan's oldest & most established",
    email: "yonten@windhorsetours.com",
    whatsapp: "(+975) 17164151",
    licenseNo: "1007938",
    yearLicensed: "1999",
    location: "Thimphu",
    website: "via Bhutan Tourism portal",
    source: "Bhutan Tourism Services Portal",
    note: "One of the oldest licensed operators in Bhutan — licensed since 1999. Official listing on government portal.",
  },
  {
    id: "yangphel-adventure-travel",
    name: "Yangphel Adventure Travel",
    tagline: "Trekking & mountaineering specialist",
    email: "Not available in this search",
    website: "Search in progress — requires further lookup",
    source: "World Travel Awards nominee, direct contact not found.",
    note: "Yangphel is a World Travel Awards nominee, but direct contact information was not found in this search. I recommend searching for their official website or checking the Bhutan Tourism Services portal directly.",
  },
];
export interface Host {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  profilePhoto?: string;
  verified: 'unverified' | 'email' | 'id';
  rating: number;
  reviewCount: number;
  spaceType: string;
  maxGuests: number;
  houseRules: string;
  isPaid: boolean;
  languages: string[];
  interests: string[];
}

export interface Buddy {
  id: string;
  name: string;
  age: number;
  bio: string;
  profilePhoto?: string;
  verified: 'unverified' | 'email' | 'id';
  destinations: string[];
  startDate: string;
  endDate: string;
  companionAge: string;
  companionGender: string;
  activities: string[];
  travelStyle: string;
  languages: string[];
}

export const hosts: Host[] = [
  {
    id: "1",
    name: "Tashi Dorji",
    age: 28,
    bio: "I'm a teacher in Thimphu who loves sharing Bhutanese culture with visitors. I speak English and can show you around the capital city.",
    location: "Thimphu",
    verified: "id",
    rating: 4.9,
    reviewCount: 12,
    spaceType: "Private room in family home",
    maxGuests: 2,
    houseRules: "Respect Buddhist traditions, no smoking, vegetarian meals preferred",
    isPaid: false,
    languages: ["English", "Dzongkha"],
    interests: ["Culture", "Hiking", "Meditation"]
  },
  {
    id: "2",
    name: "Sonam Wangchuk",
    age: 32,
    bio: "Engineer working on renewable energy projects. I can host in Paro and share stories about Bhutan's development.",
    location: "Paro",
    verified: "email",
    rating: 4.7,
    reviewCount: 8,
    spaceType: "Guest room with mountain views",
    maxGuests: 1,
    houseRules: "Keep the space clean, respect prayer times",
    isPaid: false,
    languages: ["English", "Dzongkha"],
    interests: ["Technology", "Environment", "Photography"]
  },
  {
    id: "3",
    name: "Dechen Lhamo",
    age: 25,
    bio: "Student studying tourism. Love meeting people from different cultures and practicing my English!",
    location: "Punakha",
    verified: "email",
    rating: 4.8,
    reviewCount: 15,
    spaceType: "Shared space in apartment",
    maxGuests: 3,
    houseRules: "No loud music after 10pm, help with dishes",
    isPaid: false,
    languages: ["English", "Dzongkha"],
    interests: ["Music", "Dance", "Cooking"]
  }
];

export const buddies: Buddy[] = [
  {
    id: "1",
    name: "Emma Wilson",
    age: 26,
    bio: "Solo traveler from Australia looking to explore Bhutan. Love hiking and cultural experiences.",
    verified: "email",
    destinations: ["Paro", "Thimphu", "Punakha"],
    startDate: "2024-02-15",
    endDate: "2024-02-25",
    companionAge: "25-35",
    companionGender: "any",
    activities: ["Hiking", "Cultural sites", "Photography"],
    travelStyle: "Adventure",
    languages: ["English"],
    profilePhoto: ""
  },
  {
    id: "2",
    name: "Marcus Chen",
    age: 30,
    bio: "Tech professional from Singapore. First time in Bhutan, want to meet like-minded travelers.",
    verified: "id",
    destinations: ["Thimphu", "Paro"],
    startDate: "2024-03-01",
    endDate: "2024-03-10",
    companionAge: "25-40",
    companionGender: "any",
    activities: ["Temples", "Local food", "Nature walks"],
    travelStyle: "Cultural",
    languages: ["English", "Mandarin"],
    profilePhoto: ""
  },
  {
    id: "3",
    name: "Sarah Johnson",
    age: 24,
    bio: "Backpacker from UK. Looking for travel buddies to share accommodation costs and experiences.",
    verified: "email",
    destinations: ["Paro", "Thimphu", "Phobjikha"],
    startDate: "2024-01-20",
    endDate: "2024-02-05",
    companionAge: "20-30",
    companionGender: "female",
    activities: ["Trekking", "Bird watching", "Festivals"],
    travelStyle: "Budget",
    languages: ["English"],
    profilePhoto: ""
  }
];