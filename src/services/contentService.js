// Content Service - Real-Time Firestore Sync for News & Events
// Shree Abhaydas Portal

import { collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { newsArticles as staticNews } from '../data/newsData';
import { eventsData as staticEvents } from '../data/eventsData';

const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

/**
 * Format raw date string (e.g. "2026-03-28" or ISO string) into parsed day, month, year, and human string
 */
function parseDateParts(dateStr) {
  if (!dateStr) {
    return {
      day: '01',
      month: 'MAR',
      year: '2026',
      formatted: '2026',
      timeStr: 'Upcoming'
    };
  }

  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = MONTH_NAMES[d.getMonth()] || 'MAR';
      const year = String(d.getFullYear());
      const formatted = `${day} ${month} ${year}`;
      return {
        day,
        month,
        year,
        formatted,
        timeStr: `${month} ${day} @ 8:00 pm`
      };
    }
  } catch (e) {
    // Fallback
  }

  // Handle format like "22 Mar 2026"
  const parts = String(dateStr).split(' ');
  if (parts.length >= 3) {
    return {
      day: parts[0],
      month: (parts[1] || 'MAR').toUpperCase(),
      year: parts[2] || '2026',
      formatted: dateStr,
      timeStr: `${parts[1]} ${parts[0]} @ 8:00 pm`
    };
  }

  return {
    day: '28',
    month: 'MAR',
    year: '2026',
    formatted: String(dateStr),
    timeStr: 'Upcoming'
  };
}

/**
 * Convert a Firestore news doc into standard article object
 */
export function formatFirestoreNews(id, data) {
  const dateInfo = parseDateParts(data.date || data.createdAt);
  const cleanTitle = data.title || 'Untitled Article';
  const cleanExcerpt = data.excerpt || data.description || '';

  // Extract clean paragraphs if content is HTML
  const content = data.content || `<p>${data.description || ''}</p>`;
  const plainText = cleanExcerpt || content.replace(/<[^>]*>/g, ' ').trim();

  return {
    id: id,
    title: cleanTitle,
    slug: data.slug || cleanTitle.toLowerCase().replace(/[^\w\u0900-\u097F\-]+/g, '-').replace(/^-+|-+$/g, ''),
    date: data.date ? dateInfo.formatted : (data.createdAt ? dateInfo.formatted : 'Recent'),
    day: dateInfo.day,
    month: dateInfo.month,
    year: dateInfo.year,
    author: data.author || 'Shree Abhay Das Ji Maharaj',
    category: data.category || 'General News',
    commentsCount: '0 Comments',
    image: data.featuredImage || data.url || data.imageUrl || '/images/img_30.png',
    secondaryImage: data.secondaryImage || null,
    galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages : (Array.isArray(data.additionalImages) ? data.additionalImages : (data.secondaryImage ? [data.secondaryImage] : [])),
    additionalImages: Array.isArray(data.additionalImages) ? data.additionalImages : (Array.isArray(data.galleryImages) ? data.galleryImages : (data.secondaryImage ? [data.secondaryImage] : [])),
    excerpt: plainText.slice(0, 240) + (plainText.length > 240 ? '...' : ''),
    description: data.description || plainText,
    content: content,
    fullContent: plainText,
    sections: data.sections || null,
    featured: Boolean(data.featured),
    status: data.status || 'published',
    readingTime: data.readingTime || '2 min read',
    createdAt: data.createdAt || new Date().toISOString(),
    isFromFirestore: true
  };
}

/**
 * Convert a Firestore event doc into standard event object
 */
export function formatFirestoreEvent(id, data) {
  const dateInfo = parseDateParts(data.date || data.createdAt);
  const cleanTitle = data.name || data.title || 'Upcoming Event';
  const cleanVenue = data.location || data.venue || 'Sadguru Trikam Das Ji Dham, Takhatgarh';

  return {
    id: id,
    slug: data.slug || cleanTitle.toLowerCase().replace(/[^\w\u0900-\u097F\-]+/g, '-').replace(/^-+|-+$/g, ''),
    title: cleanTitle,
    day: dateInfo.day,
    month: dateInfo.month,
    year: dateInfo.year,
    time: data.time || '8:00 PM Onwards',
    timeStr: dateInfo.timeStr,
    dateFormatted: dateInfo.formatted,
    venue: cleanVenue,
    location: cleanVenue,
    fullVenue: data.fullVenue || `${cleanVenue}, तखतगढ़ (पाली) राजस्थान`,
    artist: data.artist || 'संत सानिध्य एवं भजन संध्या',
    sanidhya: data.sanidhya || 'पावन सानिध्य: स्वामी श्री अभयदास जी महाराज',
    image: data.image || data.imageUrl || '/images/event_chhotu_singh_rawna.jpg',
    shortDescription: data.description || 'पूज्य स्वामी श्री अभयदास जी महाराज के पावन सानिध्य में आयोजित विशेष कार्यक्रम।',
    fullDescription: data.fullDescription || [
      data.description || 'पूज्य स्वामी श्री अभयदास जी महाराज के पावन सानिध्य में आयोजित विशेष कार्यक्रम।'
    ],
    schedule: (Array.isArray(data.schedule) && data.schedule.length > 0) ? data.schedule : [
      { time: '07:30 PM', activity: 'भक्तजनों का आगमन एवं स्वागत' },
      { time: '08:00 PM', activity: 'दीप प्रज्वलन एवं आशीर्वचन' },
      { time: '11:00 PM', activity: 'महाआरती एवं प्रसादी वितरण' }
    ],
    status: data.status || 'Upcoming',
    entry: 'निःशुल्क (Free Entry - All Devotees Welcome)',
    contactPhone: data.contactPhone || '+91 8696298489',
    contactEmail: 'info@shreeabhaydas.com',
    createdAt: data.createdAt || new Date().toISOString(),
    isFromFirestore: true
  };
}

/**
 * Subscribe to real-time News updates with static fallback merge
 */
export function subscribeNews(onUpdate) {
  let unsubscribe = null;

  try {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const firestoreItems = snapshot.docs.map((docSnap) =>
          formatFirestoreNews(docSnap.id, docSnap.data())
        );

        // Merge: Firestore dynamic items first, then static articles that don't collide
        const firestoreSlugs = new Set(firestoreItems.map((item) => item.slug.toLowerCase()));
        const remainingStatic = staticNews.filter(
          (s) => !firestoreSlugs.has(s.slug.toLowerCase()) && !firestoreItems.some((f) => f.id === s.id)
        );

        const merged = [...firestoreItems, ...remainingStatic];
        onUpdate(merged);
      },
      (err) => {
        console.warn('Firestore onSnapshot news note:', err.message);
        // Fallback to one-time getDocs or static
        getDocs(collection(db, 'news'))
          .then((snap) => {
            const firestoreItems = snap.docs.map((d) => formatFirestoreNews(d.id, d.data()));
            onUpdate([...firestoreItems, ...staticNews]);
          })
          .catch(() => {
            onUpdate(staticNews);
          });
      }
    );
  } catch (err) {
    console.warn('subscribeNews error:', err);
    onUpdate(staticNews);
  }

  return () => {
    if (typeof unsubscribe === 'function') unsubscribe();
  };
}

/**
 * Subscribe to real-time Events updates with static fallback merge
 */
export function subscribeEvents(onUpdate) {
  let unsubscribe = null;

  try {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const firestoreItems = snapshot.docs.map((docSnap) =>
          formatFirestoreEvent(docSnap.id, docSnap.data())
        );

        // Merge: Firestore dynamic items first, then static events
        const firestoreSlugs = new Set(firestoreItems.map((item) => item.slug.toLowerCase()));
        const remainingStatic = staticEvents.filter(
          (s) => !firestoreSlugs.has(s.slug.toLowerCase()) && !firestoreItems.some((f) => f.id === s.id)
        );

        const merged = [...firestoreItems, ...remainingStatic];
        onUpdate(merged);
      },
      (err) => {
        console.warn('Firestore onSnapshot events note:', err.message);
        getDocs(collection(db, 'events'))
          .then((snap) => {
            const firestoreItems = snap.docs.map((d) => formatFirestoreEvent(d.id, d.data()));
            onUpdate([...firestoreItems, ...staticEvents]);
          })
          .catch(() => {
            onUpdate(staticEvents);
          });
      }
    );
  } catch (err) {
    console.warn('subscribeEvents error:', err);
    onUpdate(staticEvents);
  }

  return () => {
    if (typeof unsubscribe === 'function') unsubscribe();
  };
}
