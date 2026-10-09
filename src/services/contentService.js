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
  const slug = data.slug || cleanTitle.toLowerCase().replace(/[^\w\u0900-\u097F\-]+/g, '-').replace(/^-+|-+$/g, '');

  return {
    id: id,
    title: cleanTitle,
    slug: slug,
    date: data.date ? dateInfo.formatted : (data.createdAt ? dateInfo.formatted : 'Recent'),
    day: dateInfo.day,
    month: dateInfo.month,
    year: dateInfo.year,
    author: data.author || 'Shree Abhaydas',
    category: data.category || 'General News',
    commentsCount: '0 Comments',
    comments: '0 Comments',
    image: data.featuredImage || data.url || data.imageUrl || data.image || '/images/img_30.png',
    secondaryImage: data.secondaryImage || null,
    galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages : (Array.isArray(data.additionalImages) ? data.additionalImages : (data.secondaryImage ? [data.secondaryImage] : [])),
    additionalImages: Array.isArray(data.additionalImages) ? data.additionalImages : (Array.isArray(data.galleryImages) ? data.galleryImages : (data.secondaryImage ? [data.secondaryImage] : [])),
    excerpt: plainText.slice(0, 240) + (plainText.length > 240 ? '...' : ''),
    description: data.description || plainText,
    content: content,
    fullContent: plainText,
    link: `/news/${slug}`,
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
  const slug = data.slug || cleanTitle.toLowerCase().replace(/[^\w\u0900-\u097F\-]+/g, '-').replace(/^-+|-+$/g, '');

  return {
    id: id,
    slug: slug,
    title: cleanTitle,
    name: cleanTitle,
    day: dateInfo.day,
    month: dateInfo.month,
    year: dateInfo.year,
    time: data.time || '8:00 PM Onwards',
    timeStr: data.time || dateInfo.timeStr,
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
    badge: data.badge || (data.status === 'published' ? 'Upcoming' : (data.status || 'Upcoming')),
    detailsUrl: data.detailsUrl || `/events/${slug}`,
    entry: 'निःशुल्क (Free Entry - All Devotees Welcome)',
    contactPhone: data.contactPhone || '+91 8696298489',
    contactEmail: 'info@shreeabhaydas.com',
    createdAt: data.createdAt || new Date().toISOString(),
    isFromFirestore: true
  };
}

/**
 * Local cache helpers for instant local sync
 */
function getCachedNews() {
  try {
    const raw = localStorage.getItem('shreeabhaydas_news_cache');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => formatFirestoreNews(item.id, item));
      }
    }
  } catch (e) {}
  return [];
}

function getCachedEvents() {
  try {
    const raw = localStorage.getItem('shreeabhaydas_events_cache');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => formatFirestoreEvent(item.id, item));
      }
    }
  } catch (e) {}
  return [];
}

/**
 * Subscribe to real-time News updates with cache and static fallback merge
 */
export function subscribeNews(onUpdate) {
  let unsubscribe = null;
  let latestLive = [];

  const emitMerged = (liveItems = latestLive) => {
    latestLive = liveItems;
    const cachedItems = getCachedNews();

    // Combine live Firestore items + cached items (deduplicated)
    const allDynamic = [...liveItems];
    for (const c of cachedItems) {
      if (!allDynamic.some((d) => d.id === c.id || (d.slug && d.slug === c.slug))) {
        allDynamic.push(c);
      }
    }

    // Sort dynamic items: newest first
    allDynamic.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    });

    const dynamicSlugs = new Set(allDynamic.map((item) => item?.slug?.toLowerCase()).filter(Boolean));
    const dynamicIds = new Set(allDynamic.map((item) => item?.id).filter(Boolean));

    const remainingStatic = staticNews.filter(
      (s) => !dynamicSlugs.has(s?.slug?.toLowerCase()) && !dynamicIds.has(s?.id)
    );

    const merged = [...allDynamic, ...remainingStatic];
    onUpdate(merged);
  };

  // 1. Immediately emit cached + static so the page is never blank
  emitMerged([]);

  // 2. Listen to local window events triggered when an admin saves an article
  const handleLocalUpdate = () => {
    emitMerged();
  };
  window.addEventListener('shreeabhaydas-news-updated', handleLocalUpdate);

  // 3. Subscribe to Firestore collection
  if (db) {
    try {
      const newsCol = collection(db, 'news');
      unsubscribe = onSnapshot(
        newsCol,
        (snapshot) => {
          const firestoreItems = snapshot.docs.map((docSnap) =>
            formatFirestoreNews(docSnap.id, docSnap.data())
          );
          // Update cache with fresh firestore items
          try {
            localStorage.setItem('shreeabhaydas_news_cache', JSON.stringify(firestoreItems));
          } catch (e) {}

          emitMerged(firestoreItems);
        },
        (err) => {
          console.warn('Firestore onSnapshot news note:', err.message);
          getDocs(newsCol)
            .then((snap) => {
              const firestoreItems = snap.docs.map((d) => formatFirestoreNews(d.id, d.data()));
              emitMerged(firestoreItems);
            })
            .catch(() => {
              emitMerged();
            });
        }
      );
    } catch (err) {
      console.warn('subscribeNews error:', err);
      emitMerged();
    }
  }

  return () => {
    if (typeof unsubscribe === 'function') unsubscribe();
    window.removeEventListener('shreeabhaydas-news-updated', handleLocalUpdate);
  };
}

/**
 * Subscribe to real-time Events updates with cache and static fallback merge
 */
export function subscribeEvents(onUpdate) {
  let unsubscribe = null;
  let latestLive = [];

  const emitMerged = (liveItems = latestLive) => {
    latestLive = liveItems;
    const cachedItems = getCachedEvents();

    // Combine live Firestore items + cached items (deduplicated)
    const allDynamic = [...liveItems];
    for (const c of cachedItems) {
      if (!allDynamic.some((d) => d.id === c.id || (d.slug && d.slug === c.slug))) {
        allDynamic.push(c);
      }
    }

    // Sort dynamic items: newest created or latest event date first
    allDynamic.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    });

    const dynamicSlugs = new Set(allDynamic.map((item) => item?.slug?.toLowerCase()).filter(Boolean));
    const dynamicIds = new Set(allDynamic.map((item) => item?.id).filter(Boolean));

    const remainingStatic = staticEvents.filter(
      (s) => !dynamicSlugs.has(s?.slug?.toLowerCase()) && !dynamicIds.has(s?.id)
    );

    const merged = [...allDynamic, ...remainingStatic];
    onUpdate(merged);
  };

  // 1. Immediately emit cached + static so the page is never blank
  emitMerged([]);

  // 2. Listen to local window events triggered when an admin creates an event
  const handleLocalUpdate = () => {
    emitMerged();
  };
  window.addEventListener('shreeabhaydas-events-updated', handleLocalUpdate);

  // 3. Subscribe to Firestore collection
  if (db) {
    try {
      const eventsCol = collection(db, 'events');
      unsubscribe = onSnapshot(
        eventsCol,
        (snapshot) => {
          const firestoreItems = snapshot.docs.map((docSnap) =>
            formatFirestoreEvent(docSnap.id, docSnap.data())
          );
          // Update cache with fresh firestore items
          try {
            localStorage.setItem('shreeabhaydas_events_cache', JSON.stringify(firestoreItems));
          } catch (e) {}

          emitMerged(firestoreItems);
        },
        (err) => {
          console.warn('Firestore onSnapshot events note:', err.message);
          getDocs(eventsCol)
            .then((snap) => {
              const firestoreItems = snap.docs.map((d) => formatFirestoreEvent(d.id, d.data()));
              emitMerged(firestoreItems);
            })
            .catch(() => {
              emitMerged();
            });
        }
      );
    } catch (err) {
      console.warn('subscribeEvents error:', err);
      emitMerged();
    }
  }

  return () => {
    if (typeof unsubscribe === 'function') unsubscribe();
    window.removeEventListener('shreeabhaydas-events-updated', handleLocalUpdate);
  };
}
