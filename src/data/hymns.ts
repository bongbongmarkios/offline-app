
import type { Hymn } from '@/types';

// initialSampleHymns now contains a single hymn to reset the baseline data.
export let initialSampleHymns: Hymn[] = [
  {
    id: '10008',
    titleEnglish: 'What a Friend We Have in Jesus',
    lyricsEnglish: `What a friend we have in Jesus,
All our sins and griefs to bear!
What a privilege to carry
Everything to God in prayer!
O what peace we often forfeit,
O what needless pain we bear,
All because we do not carry
Everything to God in prayer!

Have we trials and temptations?
Is there trouble anywhere?
We should never be discouraged,
Take it to the Lord in prayer.
Can we find a friend so faithful
Who will all our sorrows share?
Jesus knows our every weakness,
Take it to the Lord in prayer.

Are we weak and heavy-laden,
Cumbered with a load of care?
Precious Savior, still our refuge—
Take it to the Lord in prayer;
Do thy friends despise, forsake thee?
Take it to the Lord in prayer;
In His arms He’ll take and shield thee,
Thou wilt find a solace there.`,
    titleHiligaynon: 'ABYAN TA SI JESUS',
    lyricsHiligaynon: `Daw ano kaayo nga abyan si Jesus,
Sal-anan, kasubo ginadala N'ya!
Daw ano kaayo nga aton gindulot
Sa Dios ang tanan sa pangamuyo!
Kalinong gindula, kasakit giantus,
Kay wala ta dalha sa pangamuyo
Sa Dios ang tanan sa pangamuyo.

May pagtilaw bala kag mga kasakit?
May kagamo bala sa bisan diin?
Dili kita dapat nga magpaluya,
Dalha sa Ginoo sa pangamuyo.
May abyan bala nga masaligan gid
Nga sa kasubo ta Sia mag-unong?
Nahibaloan N'ya aton kaluyahon,
Dalha sa Ginoo sa pangamuyo.

Maluyahon bala kag nabug-atan ta,
Ginapiutan sang mga palas-anon?
Bilidhon nga Manluluwas, dalangpan ta—
Dalha sa Ginoo sa pangamuyo;
Kon mga abyan mo isikway, pabay-an ka?
Dalha sa Ginoo sa pangamuyo;
Sa Iya butkon, Iya ka sagupon,
Didto makakita ka sang kalipay.`,
    titleFilipino: 'O ANONG KAIBIGAN',
    lyricsFilipino: `O anong kaibigan si Cristo,
Lahat ng sala'y dala Niya!
Anong pribilehiyo na dalhin
Lahat sa Diyos sa panalangin!
O anong kapayapaan ang nawawala,
O anong sakit ang dinadala,
Lahat dahil di natin dinadala
Lahat sa Diyos sa panalangin!

May mga pagsubok at tukso ba tayo?
May problema ba kahit saan?
Huwag tayong panghinaan ng loob,
Dalhin sa Panginoon sa panalangin.
Makakahanap ba tayo ng kaibigang tapat
Na sa lahat ng ating pighati'y makikibahagi?
Alam ni Jesus ang bawat kahinaan natin,
Dalhin sa Panginoon sa panalangin.

Tayo ba'y mahina at nabibigatan,
Pasan-pasan ang bigat ng alalahanin?
Mahal na Tagapagligtas, kanlungan pa rin—
Dalhin sa Panginoon sa panalangin;
Minamaliit ka ba't iniiwan ng kaibigan?
Dalhin sa Panginoon sa panalangin;
Sa Kanyang bisig, ika'y Kanyang iingatan,
Doon ka makakahanap ng aliw.`,
    author: 'Joseph M. Scriven',
    category: 'Comfort and Assurance',
    pageNumber: '88',
    keySignature: 'F Major',
    externalUrl: undefined,
  },
];

// Function to update an existing hymn in the in-memory sample data
export function updateSampleHymn(hymnId: string, updatedData: Partial<Omit<Hymn, 'id'>>): Hymn | null {
  const hymnIndex = initialSampleHymns.findIndex(h => h.id === hymnId);
  if (hymnIndex === -1) {
    console.warn(`Hymn with ID ${hymnId} not found in initialSampleHymns for update.`);
    return null;
  }
  initialSampleHymns[hymnIndex] = {
    ...initialSampleHymns[hymnIndex],
    ...updatedData,
  };
  return initialSampleHymns[hymnIndex];
}

// Function to delete hymns by their IDs from the in-memory sample data
export function deleteSampleHymnsByIds(hymnIds: string[]): void {
  initialSampleHymns = initialSampleHymns.filter(hymn => !hymnIds.includes(hymn.id));
}

// Function to add a new hymn to the in-memory sample data with new ID scheme
export function addSampleHymn(hymnData: Omit<Hymn, 'id'>): Hymn {
  let maxId = 10000; // Base for hymn IDs (so first new ID will be 10001)
  initialSampleHymns.forEach(hymn => {
    const idNum = parseInt(hymn.id, 10);
    // Consider only IDs in the hymn range (e.g., 10000-19999)
    if (!isNaN(idNum) && idNum >= 10000 && idNum < 20000) {
      if (idNum > maxId) {
        maxId = idNum;
      }
    }
  });

  const newId = (maxId + 1).toString();

  const newHymn: Hymn = {
    id: newId,
    ...hymnData,
  };
  initialSampleHymns.push(newHymn);
  return newHymn;
}
