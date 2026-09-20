/* أيقونات خطية موحّدة — SVG 24×24، تأخذ لون النص الحالي */
const ICO_PATHS = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M10 20v-5h4v5"/>',
  kaaba: '<path d="M4 8.5 12 4l8 4.5v9L12 22l-8-4.5z"/><path d="M4 8.5 12 13l8-4.5"/><path d="M12 13v9"/><path d="M4 12.5 12 17l8-4.5"/>',
  hajj: '<path d="M12 3v5"/><path d="M7 21V10h10v11"/><path d="M7 14h10"/><path d="M4 21h16"/><path d="M9.5 8h5l-2.5-3z"/>',
  quran: '<path d="M4 5.5C7 4 9.5 4.3 12 6c2.5-1.7 5-2 8-.5v13c-3-1.5-5.5-1.2-8 .5-2.5-1.7-5-2-8-.5z"/><path d="M12 6v13"/>',
  beads: '<circle cx="12" cy="4.5" r="1.6"/><circle cx="17.5" cy="7" r="1.6"/><circle cx="19.5" cy="12.5" r="1.6"/><circle cx="17" cy="18" r="1.6"/><circle cx="7" cy="18" r="1.6"/><circle cx="4.5" cy="12.5" r="1.6"/><circle cx="6.5" cy="7" r="1.6"/><path d="M12 19.5v2"/>',
  check: '<path d="M4 12.5 9 17.5 20 6.5"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.5 2"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 17h.01M12 17h.01"/>',
  chat: '<path d="M20 12a7.5 7.5 0 0 1-11 6.6L4 20l1.4-4.6A7.5 7.5 0 1 1 20 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>',
  mosque: '<path d="M3 21h18"/><path d="M5 21v-7h14v7"/><path d="M7 14c0-3 5-6 5-6s5 3 5 6"/><path d="M12 8V5.5"/><path d="M11 5.5h2"/><path d="M4 21v-9M20 21v-9"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
  pin: '<path d="M12 21s-6.5-5.5-6.5-11a6.5 6.5 0 0 1 13 0c0 5.5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3z"/><path d="M5 4v16"/><path d="M8 20h11"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8.5 5 3.5-5 3.5z"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  cloud: '<path d="M7 18h10a4 4 0 0 0 .5-8A5.5 5.5 0 0 0 7 11a3.5 3.5 0 0 0 0 7z"/>',
  moon: '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>'
};
function ico(n, cls) { return `<svg class="ico ${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO_PATHS[n] || ""}</svg>`; }
