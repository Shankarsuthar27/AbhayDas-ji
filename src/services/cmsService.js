import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { websiteData } from '../data/websiteData';

// Storage Key for Offline & Instant Cache
const CMS_STORAGE_KEY = 'shree_homepage_cms_v2';

// Default Comprehensive Homepage Data Blueprint
export const DEFAULT_HOMEPAGE_CMS = {
  // 1. Header & Navigation (Matching Screenshot Navbar Layout)
  header: {
    logo: websiteData.general.logos.main || '/images/img_1.png',
    actionButtonText: 'The form is not published.',
    actionButtonUrl: '#donate',
    menuItems: [
      { id: 'm1', label: 'Home', url: '/', status: 'published' },
      { id: 'm2', label: 'About Us', url: '/about', status: 'published' },
      { id: 'm3', label: 'Event', url: '/events', status: 'published' },
      { id: 'm4', label: 'Volunteers', url: '#team', status: 'published' },
      { id: 'm5', label: 'Kathas', url: '/kathas', status: 'published' },
      { id: 'm6', label: 'Gallery', url: '/gallery', status: 'published' },
      { id: 'm7', label: 'Pages', url: '#pages', status: 'published' }
    ]
  },

  // 2. Hero Section
  hero: {
    backgroundMedia: '/images/img_4.jpg',
    mediaType: 'image', // 'image' | 'video'
    badge: 'A Journey of Devotion, Dharma & Divine Guidance',
    headingLine1: 'Preserving Heritage,',
    headingLine2: 'Inspiring Generations',
    paragraph: 'Welcome to the official spiritual platform of HH Pujya Acharya Swami Shri Abhaydas Ji Maharaj, dedicated to Sanatan values, sacred discourses, seva, and cultural awakening.',
    primaryBtnText: 'Donate Now',
    primaryBtnUrl: '#donate',
    watchVideoText: 'Watch Video',
    watchVideoUrl: 'https://www.youtube.com/live/X0UPcFj_ZNQ?si=4ePCh00jF7hwtkOp',
    slides: [
      {
        id: 'hs1',
        title: 'Preserving Heritage, Inspiring Generations',
        badge: 'Seva • Sanskar • Parampara',
        desc: 'Rooted in sacred parampara and guided by service, the mission of Maharaj Ji reflects devotion, Gurukul values, and spiritual upliftment.',
        image: '/images/img_3.jpg',
        status: 'published'
      },
      {
        id: 'hs2',
        title: 'Swami Shri Abhaydas Ji Maharaj',
        badge: 'A Journey of Devotion, Dharma & Divine Guidance',
        desc: 'Dedicated to the revival of Sanatan moral values, humanitarian seva, Gau Seva, and spiritual awakening across society.',
        image: '/images/img_4.jpg',
        status: 'published'
      },
      {
        id: 'hs3',
        title: 'Spreading the Light of Sanatan Wisdom',
        badge: 'Sacred Kathas & Pravachans',
        desc: 'Discover the spiritual teachings through Shreemad Bhagwad Katha, Shree Ram Katha, Meera Katha, and devotional discourses.',
        image: '/images/img_5.jpg',
        status: 'published'
      }
    ]
  },

  // 3. Brief Introduction Section
  about: {
    sectionLabel: 'About Us',
    mainHeading: 'Brief Introduction',
    paragraph: 'Pujya Abhaydas Ji Maharaj Shri is a spiritual guru, religious preacher, and social reformer who embraced the path of dharma and humanitarian service from early childhood. At the tender age of four, he received spiritual initiation (Diksha) from the pujya Acharya Shri Nirbhaydas Ji Maharaj Shri. Since then, he has been wholly dedicated to the promotion of spirituality, moral values, Indian culture, and spiritual awakening. He is presently seated as the fifth Acharya (heir apparent) of the 150-year-old Sadguru Trikam Das Ji Dham tradition located in Takhatgarh, Pali district, Rajasthan, and continues to carry forward its sacred spiritual legacy.',
    artworkImage: '/images/img_9.jpg',
    portraitImage: '/images/img_10.jpg',
    readMoreButtonText: 'Read More',
    readMoreButtonUrl: '/about',
    videoUrl: 'https://www.youtube.com/live/X0UPcFj_ZNQ?si=4ePCh00jF7hwtkOp'
  },

  // 4. Spiritual Katha (Carousel/Grid)
  spiritualKathas: {
    subheading: 'DEVOTIONAL DISCOURSES',
    mainTitle: "Spiritual Katha'",
    items: [
      {
        id: 'k1',
        title: 'Shrimad Bhagwad Katha',
        image: '/images/img_11.jpg',
        link: '/kathas/shrimad-bhagwat-katha',
        status: 'published'
      },
      {
        id: 'k2',
        title: 'Nani Bai Ka Mayra',
        image: '/images/img_12.jpg',
        link: '/kathas/nani-bai-ka-mayra',
        status: 'published'
      },
      {
        id: 'k3',
        title: 'Baba Ramdev Katha',
        image: '/images/img_13.png',
        link: '/kathas/baba-ramdev-ji-katha',
        status: 'published'
      }
    ]
  },

  // 5. Donation Section
  donations: {
    subheading: 'HELP THE NEEDY',
    mainTitle: 'Find The Popular Cause And Donate Them',
    campaigns: [
      {
        id: 'c1',
        title: 'Your small help can bring a Better Life to Everyone',
        image: '/images/img_14.avif',
        goal: 50000,
        raised: 0,
        donateUrl: '#donate',
        status: 'published'
      },
      {
        id: 'c2',
        title: 'Clean water, healthy food and nutrition for rural villages',
        image: '/images/img_15.jpg',
        goal: 50000,
        raised: 18500,
        donateUrl: '#donate',
        status: 'published'
      },
      {
        id: 'c3',
        title: 'Takhatgarh Gurukulam education for tribal & needy children',
        image: '/images/img_16.jpg',
        goal: 75000,
        raised: 35000,
        donateUrl: '#donate',
        status: 'published'
      },
      {
        id: 'c4',
        title: 'Sacred Gaushala healthcare, nutrition & protective shelter',
        image: '/images/img_17.jpg',
        goal: 50000,
        raised: 0,
        donateUrl: '#donate',
        status: 'published'
      }
    ]
  },

  // 6. Gallery Section
  gallery: {
    heading: 'Shrimad Bhagwad Katha * Ram Katha',
    viewMoreText: 'View More Gallery',
    viewMoreUrl: '/gallery',
    images: [
      { id: 'g1', src: '/images/img_17.jpg', url: '/images/img_17.jpg', title: 'Pujya Maharaj Ji with Saints & Devotees', status: 'published' },
      { id: 'g2', src: '/images/img_18.jpg', url: '/images/img_18.jpg', title: 'Devotee Offering Pranam & Sacred Blessings', status: 'published' },
      { id: 'g3', src: '/images/img_19.jpg', url: '/images/img_19.jpg', title: 'Spiritual Discourse & Guidance Session', status: 'published' },
      { id: 'g4', src: '/images/img_20.jpg', url: '/images/img_20.jpg', title: 'Evening Satsang & Devotional Bhajan Sandhya', status: 'published' },
      { id: 'g5', src: '/images/img_21.jpg', url: '/images/img_21.jpg', title: 'National Honor & Sacred Felicitation Ceremony', status: 'published' },
      { id: 'g6', src: '/images/img_22.jpg', url: '/images/img_22.jpg', title: 'Takhatgarh Dham Seva & Community Assembly', status: 'published' }
    ]
  },

  // 7. Recent Katha Section
  recentKatha: {
    title: 'Recent Katha',
    viewAllText: 'View All',
    viewAllUrl: '/kathas',
    mediaCards: [
      {
        id: 'rk1',
        title: 'श्री अभयदास जी महाराज श्रीमद् भागवत कथा',
        thumbnail: '/images/img_25.jpg',
        dateText: '9:41 / 2:56:26',
        mediaUrl: 'https://www.youtube.com/live/X0UPcFj_ZNQ?si=4ePCh00jF7hwtkOp',
        status: 'published'
      },
      {
        id: 'rk2',
        title: 'यशस्वी प्रधानमंत्री श्री Narendra Modi Ji को जन्मदिन की हार्दिक शुभकामनाएँ।',
        thumbnail: '/images/img_22.jpg',
        dateText: '1:15 / 15:42',
        mediaUrl: 'https://youtu.be/McOEP5OqUfs?si=kUsE_tcWbFowqFUu',
        status: 'published'
      },
      {
        id: 'rk3',
        title: 'Abhaydas Ji Maharaj ने हरिजन बस्ती में भिक्षा लेने का कारण बताया',
        thumbnail: '/images/img_23.jpg',
        dateText: '3:40 / 24:18',
        mediaUrl: 'https://youtu.be/8NbRkLdLR7s?si=BmBKRguTatBeID3d',
        status: 'published'
      },
      {
        id: 'rk4',
        title: 'Meera Bhajan – मुरली वाला आजा म्हारे देश । Abhaydas ji maharaj',
        thumbnail: '/images/img_24.webp',
        dateText: '2:08 / 18:05',
        mediaUrl: 'https://youtu.be/DDT8ydNRGnE?si=gyJqxaqOcf4RD9Qv',
        status: 'published'
      }
    ]
  },

  // 8. Upcoming Event Schedule
  events: {
    title: 'Upcoming Event Schedule',
    viewAllText: 'Events All',
    viewAllUrl: '/events',
    items: [
      {
        id: 'ev1',
        day: '28',
        month: 'MAR',
        title: 'तखतगढ़ धाम भजन संध्या - 28 मार्च',
        time: '8:00 PM Onwards',
        location: 'Takhatgarh Dham, Pali',
        detailsUrl: '/events/takhatgarh-bhajan-sandhya-28-march',
        status: 'published'
      },
      {
        id: 'ev2',
        day: '27',
        month: 'MAR',
        title: 'तखतगढ़ धाम दिव्य महोत्सव - 27 मार्च',
        time: '8:00 PM Onwards',
        location: 'Takhatgarh Dham, Pali',
        detailsUrl: '/events/takhatgarh-divya-mahotsav-27-march',
        status: 'published'
      },
      {
        id: 'ev3',
        day: '15',
        month: 'APR',
        title: 'वार्षिक पाटोत्सव एवं महाआरती',
        time: '7:00 PM Onwards',
        location: 'Sadguru Trikam Das Ji Dham',
        detailsUrl: '/events',
        status: 'published'
      }
    ]
  },

  // 9. Latest News and Articles
  news: {
    title: 'Latest News And Articles',
    viewAllText: 'View All',
    viewAllUrl: '/news',
    articles: [
      {
        id: 'n1',
        title: 'तखतगढ़ में 500 बच्चों के लिए आधुनिक गुरुकुलम का भव्य लोकार्पण',
        featuredImage: '/images/img_30.png',
        date: 'Recent',
        author: 'Shree Abhaydas',
        readMoreUrl: '/news',
        status: 'published'
      },
      {
        id: 'n2',
        title: 'मारवाड़ में गौ सेवा एवं संवर्धन हेतु अत्याधुनिक गौशाला का शुभारंभ',
        featuredImage: '/images/img_31.webp',
        date: 'Recent',
        author: 'Shree Abhaydas',
        readMoreUrl: '/news',
        status: 'published'
      },
      {
        id: 'n3',
        title: 'पूज्य अभयदास जी महाराज के पावन सानिध्य में विराट धर्मसभा संपन्न',
        featuredImage: '/images/img_32.jpg',
        date: 'Recent',
        author: 'Shree Abhaydas',
        readMoreUrl: '/news',
        status: 'published'
      }
    ]
  },

  // 10. Testimonials / Success Stories (Team / Reviews)
  testimonials: {
    title: 'Meet the team behind their success story',
    subheading: 'WHAT WE DO',
    items: [
      {
        id: 't1',
        name: 'Sachin Sharma',
        role: 'General Manager',
        reviewText: 'Managing the operations and nationwide outreach under the guidance of Maharaj Shri.',
        avatar: '',
        status: 'published'
      },
      {
        id: 't2',
        name: 'Vijay Raj Chouhan',
        role: 'PS',
        reviewText: 'Coordinating sacred events, katha dates, and administrative activities for the ashram.',
        avatar: '',
        status: 'published'
      },
      {
        id: 't3',
        name: 'Bhanwar Suthar',
        role: 'IT Head',
        reviewText: 'Heading the digital broadcast, official website, and media outreach for worldwide devotees.',
        avatar: '',
        status: 'published'
      }
    ]
  },

  // 11. Contact CTA Banner
  contactBanner: {
    phone: '+91 94142 84180',
    email: 'info@shreeabhaydas.com',
    location: 'Takhatgarh Dham, Rajasthan, India'
  },

  // 12. Footer
  footer: {
    logo: websiteData.general.logos.main || '/images/img_1.png',
    description: 'Pujya Abhaydas Ji Maharaj Shri is dedicated to the preservation of Sanatan Dharma, Vedic values, humanitarian service, Gau Seva, and tribal education.',
    copyright: '© 2026 Shree Abhaydas Ji Maharaj. All Rights Reserved.',
    showNewsWidget: true,
    socialLinks: {
      facebook: 'https://facebook.com/shreeabhaydas',
      youtube: 'https://www.youtube.com/@ShreeAbhaydas',
      instagram: 'https://instagram.com/shreeabhaydas',
      twitter: 'https://twitter.com/shreeabhaydas'
    },
    quickLinks: [
      { id: 'ql1', label: 'Upcoming Events', url: '/events', status: 'published' },
      { id: 'ql2', label: 'Volunteers', url: '#team', status: 'published' },
      { id: 'ql3', label: 'Photo Gallery', url: '/gallery', status: 'published' },
      { id: 'ql4', label: 'About Us', url: '/about', status: 'published' }
    ],
    ourServices: [
      { id: 'os1', label: 'Food & Water Charity', url: '#donate', status: 'published' },
      { id: 'os2', label: 'Sent A Gift For Children', url: '#donate', status: 'published' },
      { id: 'os3', label: 'Make Donation', url: '#donate', status: 'published' },
      { id: 'os4', label: 'Gau Seva & Gaushala', url: '#donate', status: 'published' }
    ]
  }
};

/**
 * Load cached CMS config from localStorage synchronously
 */
export function getLocalCmsData() {
  if (typeof window === 'undefined') return DEFAULT_HOMEPAGE_CMS;
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return DEFAULT_HOMEPAGE_CMS;
    const parsed = JSON.parse(raw);
    return deepMerge(DEFAULT_HOMEPAGE_CMS, parsed);
  } catch (err) {
    console.warn('Error reading local CMS data:', err);
    return DEFAULT_HOMEPAGE_CMS;
  }
}

/**
 * Save CMS config to Firestore and localStorage
 */
export async function saveHomepageCms(data) {
  try {
    const merged = deepMerge(DEFAULT_HOMEPAGE_CMS, data);
    
    // 1. Cache to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(merged));
      // Dispatch custom event for real-time same-window updates
      window.dispatchEvent(new CustomEvent('shree_cms_updated', { detail: merged }));
    }

    // 2. Persist to Firestore
    try {
      const docRef = doc(db, 'settings', 'homepage');
      await setDoc(docRef, { ...merged, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (firestoreErr) {
      console.warn('Firestore CMS sync note (local cache active):', firestoreErr.message);
    }

    return { success: true, data: merged };
  } catch (err) {
    console.error('Failed to save CMS data:', err);
    throw err;
  }
}

/**
 * Real-time subscription to CMS changes from Firestore & LocalStorage
 */
export function subscribeHomepageCms(callback) {
  // Initial fire with cached data
  const initial = getLocalCmsData();
  callback(initial);

  // Firestore Live Listener
  let unsubFirestore = () => {};
  try {
    if (db) {
      const docRef = doc(db, 'settings', 'homepage');
      unsubFirestore = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const remoteData = docSnap.data();
            const merged = deepMerge(DEFAULT_HOMEPAGE_CMS, remoteData);
            if (typeof window !== 'undefined') {
              localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(merged));
            }
            callback(merged);
          }
        },
        (err) => {
          console.warn('Firestore live listener note:', err.message);
        }
      );
    }
  } catch (err) {
    console.warn('Firestore subscription unavailable:', err.message);
  }

  // Window event listener for local instant updates across components
  const handleLocalUpdate = (e) => {
    if (e.detail) {
      callback(e.detail);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('shree_cms_updated', handleLocalUpdate);
  }

  return () => {
    unsubFirestore();
    if (typeof window !== 'undefined') {
      window.removeEventListener('shree_cms_updated', handleLocalUpdate);
    }
  };
}

/**
 * Helper to deep merge objects
 */
function deepMerge(target, source) {
  if (!source) return target;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] instanceof Object &&
      !Array.isArray(source[key]) &&
      key in target &&
      target[key] instanceof Object &&
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}
