
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
    author: 'John Newton',
    category: 'Grace',
    pageNumber: '202',
    keySignature: 'G Major',
    // titleFilipino: 'Kahanga-hangang Biyaya',
    // lyricsFilipino: '...',
    // titleHiligaynon: 'Makalilipay nga Grasya',
    // lyricsHiligaynon: '...',
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
    author: 'Carl Boberg, Stuart K. Hine (Translator)',
    category: 'Praise',
    pageNumber: '77',
    keySignature: 'Bb Major',
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
