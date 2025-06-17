
import type { Hymn } from '@/types';

// Changed from const to let to allow adding new hymns
export let sampleHymns: Hymn[] = [
  {
    id: '1',
    titleEnglish: 'Amazing Grace',
    lyricsEnglish: `Amazing grace! How sweet the sound
That saved a wretch like me!
I once was lost, but now am found;
Was blind, but now I see.

’Twas grace that taught my heart to fear,
And grace my fears relieved;
How precious did that grace appear
The hour I first believed.

Through many dangers, toils, and snares,
I have already come;
’Tis grace hath brought me safe thus far,
And grace will lead me home.

The Lord has promised good to me,
His Word my hope secures;
He will my Shield and Portion be,
As long as life endures.`,
    titleHiligaynon: 'MAKAHALAHALAWAT NGA GRASYA',
    lyricsHiligaynon: `Makahalahalawat nga grasya! Daw ano katam-is
Nga nagluwas sa akon nga makaluluoy!
Sadto nadula ako, apang karon nakita na;
Bulag, apang karon makakita na.

Grasya ang nagtudlo sa akon tagipusuon sa kahadlok,
Kag grasya ang nagpakanay sang akon mga kahadlok;
Daw ano ka hamili sadtong grasya
Sang tion nga una ako nagtuo.

Sa madamo nga katalagman, kabudlayan, kag siod,
Ako nakaagi na;
Grasya ang nagdala sa akon nga luwas tubtob diri,
Kag grasya ang magadala sa akon pauli.

Ang Ginoo nagpromisa sing maayo sa akon,
Ang Iya Pulong nagapasalig sang akon paglaum;
Sia mangin akon Taming kag Bahin,
Samtang ang kabuhi nagapadayon.`,
    titleFilipino: 'BIYAYANG KAHANGA-HANGA', // Added Filipino Title
    lyricsFilipino: `Biyayang kahanga-hanga! Anong tamis ng tunog
Na nagligtas sa tulad kong hamak!
Dati'y nawala, ngayo'y natagpuan;
Naging bulag, ngayo'y nakakakita na.

Biyaya ang nagturo sa puso kong matakot,
At biyaya ang pawi sa aking takot;
Kay mahalaga ng biyayang iyon
Nang oras na una akong naniwala.

Sa maraming panganib, hirap, at patibong,
Ako'y nakarating na;
Biyaya ang nagdala sa akin hanggang dito,
At biyaya ang maghahatid sa akin pauwi.

Panginoo'y nangako ng mabuti sa akin,
Salita Niya'y pag-asa kong matibay;
Siya'y magiging Kalasag at Bahagi ko,
Habang buhay ay nagpapatuloy.`, // Added Filipino Lyrics
    author: 'John Newton',
    category: 'Grace',
    pageNumber: '202',
    keySignature: 'G Major',
  },
  {
    id: '2',
    titleEnglish: 'Great Is Thy Faithfulness',
    lyricsEnglish: `Great is Thy faithfulness, O God my Father;
There is no shadow of turning with Thee;
Thou changest not, Thy compassions, they fail not;
As Thou hast been Thou forever wilt be.

Refrain:
Great is Thy faithfulness! Great is Thy faithfulness!
Morning by morning new mercies I see;
All I have needed Thy hand hath provided;
Great is Thy faithfulness, Lord, unto me!

Summer and winter, and springtime and harvest,
Sun, moon and stars in their courses above,
Join with all nature in manifold witness
To Thy great faithfulness, mercy and love.

Pardon for sin and a peace that endureth,
Thine own dear presence to cheer and to guide;
Strength for today and bright hope for tomorrow,
Blessings all mine, with ten thousand beside!`,
    titleHiligaynon: 'DAKU ANG IMO KATUTUM', 
    lyricsHiligaynon: `Daku ang Imo katutum, O Dios ko nga Amay;
Wala sing landong sang pagbag-o sa Imo;
Wala Ka nagabag-o, ang Imo kaluoy, wala nagakapaslaw;
Subong nga Ikaw sadto, Ikaw mangin sa gihapon.

Koro:
Daku ang Imo katutum! Daku ang Imo katutum!
Kada aga bag-o nga kaluoy ang akon makita;
Ang tanan nga akon kinahanglan gin-aman sang Imo kamot;
Daku ang Imo katutum, Ginoo, sa akon!

Tig-ilinit kag tig-ululan, kag tigpamulak kag tig-ani,
Adlaw, bulan kag mga bituon sa ila alagyan sa ibabaw,
Mag-upod sa bug-os nga kinaiya sa nanuhaytuhay nga pagpamatuod
Sa Imo daku nga katutum, kaluoy kag gugma.

Kapatawaran sa sala kag paghidaet nga nagapadayon,
Ang Imo mismo presensya sa paglipay kag paggiya;
Kusog para sa karon kag masanag nga paglaum para sa buas,
Mga bugay tanan akon, upod ang napulo ka libo pa!`, 
    author: 'Thomas O. Chisholm',
    category: 'Faithfulness',
    pageNumber: '100',
    keySignature: 'Eb Major',
  },
  {
    id: '3',
    titleEnglish: 'How Great Thou Art',
    lyricsEnglish: `O Lord my God, when I in awesome wonder
Consider all the worlds Thy Hands have made;
I see the stars, I hear the rolling thunder,
Thy power throughout the universe displayed.

Refrain:
Then sings my soul, my Saviour God, to Thee,
How great Thou art, how great Thou art.
Then sings my soul, my Saviour God, to Thee,
How great Thou art, how great Thou art!

When through the woods, and forest glades I wander,
And hear the birds sing sweetly in the trees.
When I look down, from lofty mountain grandeur
And see the brook, and feel the gentle breeze.

And when I think, that God, His Son not sparing;
Sent Him to die, I scarce can take it in;
That on the Cross, my burden gladly bearing,
He bled and died to take away my sin.

When Christ shall come, with shout of acclamation,
And take me home, what joy shall fill my heart.
Then I shall bow, in humble adoration,
And then proclaim: "My God, how great Thou art!"`,
    titleHiligaynon: 'DAW ANO KA GAMHANAN', 
    lyricsHiligaynon: `O Ginoo ko nga Dios, kon ako sa makahalawhaw nga katingala
Ginahunahuna ang tanan nga kalibutan nga ginhimo sang Imo mga Kamot;
Makita ko ang mga bituon, mabatian ko ang nagadaguob nga daguob,
Ang Imo gahum sa bug-os nga uniberso ginpakita.

Koro:
Dayon nagaamba ang akon kalag, Manluluwas ko nga Dios, sa Imo,
Daw ano Ka gamhanan, daw ano Ka gamhanan.
Dayon nagaamba ang akon kalag, Manluluwas ko nga Dios, sa Imo,
Daw ano Ka gamhanan, daw ano Ka gamhanan!

Kon sa mga kakahuyan, kag mga latagon sa kagulangan ako nagalakat,
Kag mabatian ang mga pispis nga nagaamba sing matam-is sa mga kahoy.
Kon ako maglantaw sa idalom, gikan sa mataas nga bukid
Kag makita ang sapa, kag mabatyagan ang mahinay nga huyop sang hangin.

Kag kon ako maghunahuna, nga ang Dios, ang Iya Anak wala ginpunggan;
Ginpadala Sia sa pagkamatay, halos indi ko mabaton;
Nga sa Krus, ang akon lulan malipayon nga ginpas-an,
Nagtulo ang Iya dugo kag namatay agud kuhaon ang akon sala.

Kon si Kristo mag-abot, nga may singgit sang pagdayaw,
Kag dalhon ako pauli, ano nga kalipay ang magapuno sang akon tagipusuon.
Dayon ako magayaub, sa mapainubuson nga pagsimba,
Kag dayon magproklamar: "Dios ko, daw ano Ka gamhanan!"`, 
    author: 'Carl Boberg, Stuart K. Hine (Translator)',
    category: 'Praise',
    pageNumber: '77',
    keySignature: 'Bb Major',
  },
  {
    id: '4',
    titleEnglish: 'To God Be The Glory',
    lyricsEnglish: `To God be the glory, great things He hath done,
So loved He the world that He gave us His Son,
Who yielded His life an atonement for sin,
And opened the life gate that all may go in.

Refrain:
Praise the Lord, praise the Lord, let the earth hear His voice!
Praise the Lord, praise the Lord, let the people rejoice!
O come to the Father, through Jesus the Son,
And give Him the glory, great things He hath done.

O perfect redemption, the purchase of blood,
To every believer the promise of God;
The vilest offender who truly believes,
That moment from Jesus a pardon receives.

Great things He hath taught us, great things He hath done,
And great our rejoicing through Jesus the Son;
But purer, and higher, and greater will be
Our wonder, our transport, when Jesus we see.`,
    titleHiligaynon: 'SA DIOS ANG HIMAYA',
    lyricsHiligaynon: `SA DIOS ANG HIMAYA, DAKU GID ANG NAHIMO NIYA,
GINHIGUGMA NIYA ANG KALIBUTAN NGA GINHATAG NIYA ANG IYA ANAK,
NGA NAGHALAD SANG IYA KABUHI PARA SA KATUBUSAN SANG SALA,
KAG GIN-ABRIHAN ANG GANHAAN SANG KABUHI AGUD ANG TANAN MAKASULOD.

Koro:
Dayawa ang Ginoo, dayawa ang Ginoo, pamatia sang duta ang Iya tingog!
Dayawa ang Ginoo, dayawa ang Ginoo, magkalipay ang mga tawo!
Oh kari sa Amay, paagi kay Jesus nga Anak,
Kag ihatag sa Iya ang himaya, daku gid ang nahimo Niya.

O himpit nga katubusan, ang bili sang dugo,
Sa tagsa ka tumuluo ang saad sang Dios;
Ang labing makasasala nga matuod nga nagatuo,
Sa sadto nga tion gikan kay Jesus makabaton sang kapatawaran.

Daku nga mga butang ang Iya gintudlo sa aton, daku nga mga butang ang Iya nahimo,
Kag daku ang aton kalipay paagi kay Jesus nga Anak;
Apang mas putli, kag mas mataas, kag mas daku pa
Ang aton katingala, ang aton kalipay, kon si Jesus aton makita.`,
    pageNumber: '79',
    keySignature: 'G Major',
    author: 'Fanny Crosby',
    composer: 'William H. Doane',
    category: 'Praise and Adoration',
  }
];

// Function to add a new hymn to the sample data
export function addSampleHymn(hymnData: Omit<Hymn, 'id'>): Hymn {
  const newId = 'hymn-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000);
  const newHymn: Hymn = {
    id: newId,
    ...hymnData,
  };
  sampleHymns.push(newHymn);
  return newHymn;
}

    