export interface BirthdayWish {
  id: string;
  title: string;
  subtitle: string;
  category: 'bunga' | 'stroberi' | 'doa' | string;
  badge: string;
  badgeColor: string;
  content: string;
  highlight: string;
  accentIcon: 'flower' | 'strawberry' | 'sparkle' | 'heart';
}

export const BIRTHDAY_INFO = {
  name: 'Renathaa',
  age: 'Special Day',
  greeting: 'Selamat Ulang Tahun!',
  tagline: 'Just a small gift...',
};

export const BIRTHDAY_WISHES: BirthdayWish[] = [
  {
    id: 'wish-1',
    title: 'First page',
    subtitle: 'Apologize',
    category: 'bunga',
    badge: 'The Flower',
    badgeColor: '#F472B6',
    content:
      'Maaf... aku minta maaf karena bisa jadi hadiah ini dikirim setelah beberapa hari/minggu/bulan setelah kamu ulang tahun, dan sekali lagi maaf juga karena aku masih netapin janji itu...',
    highlight: 'Well is just from a dumb people... but thankyou for reading this text',
    accentIcon: 'flower',
  },
  {
    id: 'wish-2',
    title: 'Second page',
    subtitle: 'Birthday',
    category: 'stroberi',
    badge: 'Eighteen',
    badgeColor: '#E11D48',
    content:
      'Happy Birthday Renatha Angelina, Selamat ulang tahun yang ke 18... mungkin emang bener apa yang aku bilang di letter sebelumnya, mungkin web ini bakal telat di kirim atau bahkan cuman aku simpen aja, tapi kalo emang web ini bisa kamu baca, selamat ulang tahun yang ke 18 yaa Ren...',
    highlight: 'May every step you take feel meaningful.',
    accentIcon: 'strawberry',
  },
  {
    id: 'wish-3',
    title: 'Third Page',
    subtitle: 'Prays',
    category: 'doa',
    badge: 'Heartfelt Prayer',
    badgeColor: '#DB2777',
    content:
      'Semoga kamu selalu diberikan kesehatan raga dan ketenangan jiwa. Dijauhkan dari rasa cemas, didekatkan dengan kebaikan, dan selalu dikelilingi oleh orang-orang yang tulus sayang ke kamu apa adanya, semoga di tahun tahun berikutnya, kamu bisa selalu ngerasain bahagia',
    highlight: 'cause you deserve.',
    accentIcon: 'heart',
  },
  {
    id: 'wish-4',
    title: 'Fourth page',
    subtitle: 'Phrase',
    category: 'bunga',
    badge: 'Sebuah Ungkapan',
    badgeColor: '#BE185D',
    content:
      'Kepada Tuhan tolong lindungi wanita ini dari berbagai hal yang selalu ingin menjatuhkannya, tolong jaga dia dari segalanya, dan terima kasih karena telah memberikan sesuatu hal yang sangat spesial di hidup ini.',
    highlight: 'Selamat bertambah usia, semoga semesta selalu ngejagain kamu! ✨',
    accentIcon: 'sparkle',
  },
  {
    id: 'wish-5',
    title: 'Last page',
    subtitle: 'Someone',
    category: 'Prays',
    badge: 'Long time no see',
    badgeColor: '#BE185D',
    content:
      'how have you been Nat? its almost 2 years right? mungkin aneh kalo aku bilang aku masih punya rasa ke kamu, aneh banget dengan semua hal yang memang udah kejadian di kehidupan kita masing masing, kamu dengan seseorang yang bener bener cocok sama kamu, bahkan aku selalu minta ke tuhan, "semoga kali ini dia bener bener selalu bisa ngerasain bahagia", aku ga pernah ngerti, kenapa aku ga pernah bisa ngehapus perasaan aku ke kamu, dengan cara nge ihklasin juga aku tetep aja... makasih udah pernah ada di hidup aku, makasii karena dengan aku ketemu kamu, aku selalu berusaha jadi lebih baik... dan maaff nat maaf kalau aku masih nepatin janji itu ke kamu... i loved you',
    highlight: 'Cause I always loved you.',
    accentIcon: 'sparkle',
  }
];
