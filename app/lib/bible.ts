export const BibleBookNumberToNameMap = {
	[1]: 'Genesis',
	[2]: 'Exodus',
	[3]: 'Leviticus',
	[4]: 'Numbers',
	[5]: 'Deuteronomy',
	[6]: 'Joshua',
	[7]: 'Judges',
	[8]: 'Ruth',
	[9]: '1 Samuel',
	[10]: '2 Samuel',
	[11]: '1 Kings',
	[12]: '2 Kings',
	[13]: '1 Chronicles',
	[14]: '2 Chronicles',
	[15]: 'Ezra',
	[16]: 'Nehemiah',
	[17]: 'Esther',
	[18]: 'Job',
	[19]: 'Psalms',
	[20]: 'Proverbs',
	[21]: 'Ecclesiastes',
	[22]: 'Song of Solomon',
	[23]: 'Isaiah',
	[24]: 'Jeremiah',
	[25]: 'Lamentations',
	[26]: 'Ezekiel',
	[27]: 'Daniel',
	[28]: 'Hosea',
	[29]: 'Joel',
	[30]: 'Amos',
	[31]: 'Obadiah',
	[32]: 'Jonah',
	[33]: 'Micah',
	[34]: 'Nahum',
	[35]: 'Habakkuk',
	[36]: 'Zephaniah',
	[37]: 'Haggai',
	[38]: 'Zechariah',
	[39]: 'Malachi',
	[40]: 'Matthew',
	[41]: 'Mark',
	[42]: 'Luke',
	[43]: 'John',
	[44]: 'Acts',
	[45]: 'Romans',
	[46]: '1 Corinthians',
	[47]: '2 Corinthians',
	[48]: 'Galatians',
	[49]: 'Ephesians',
	[50]: 'Philippians',
	[51]: 'Colossians',
	[52]: '1 Thessalonians',
	[53]: '2 Thessalonians',
	[54]: '1 Timothy',
	[55]: '2 Timothy',
	[56]: 'Titus',
	[57]: 'Philemon',
	[58]: 'Hebrews',
	[59]: 'James',
	[60]: '1 Peter',
	[61]: '2 Peter',
	[62]: '1 John',
	[63]: '2 John',
	[64]: '3 John',
	[65]: 'Jude',
	[66]: 'Revelation',
};

export const BibleBookNameToNumberMap = {
	Genesis: 1,
	Exodus: 2,
	Leviticus: 3,
	Numbers: 4,
	Deuteronomy: 5,
	Joshua: 6,
	Judges: 7,
	Ruth: 8,
	'1 Samuel': 9,
	'2 Samuel': 10,
	'1 Kings': 11,
	'2 Kings': 12,
	'1 Chronicles': 13,
	'2 Chronicles': 14,
	Ezra: 15,
	Nehemiah: 16,
	Esther: 17,
	Job: 18,
	Psalms: 19,
	Proverbs: 20,
	Ecclesiastes: 21,
	'Song of Solomon': 22,
	Isaiah: 23,
	Jeremiah: 24,
	Lamentations: 25,
	Ezekiel: 26,
	Daniel: 27,
	Hosea: 28,
	Joel: 29,
	Amos: 30,
	Obadiah: 31,
	Jonah: 32,
	Micah: 33,
	Nahum: 34,
	Habakkuk: 35,
	Zephaniah: 36,
	Haggai: 37,
	Zechariah: 38,
	Malachi: 39,
	Matthew: 40,
	Mark: 41,
	Luke: 42,
	John: 43,
	Acts: 44,
	Romans: 45,
	'1 Corinthians': 46,
	'2 Corinthians': 47,
	Galatians: 48,
	Ephesians: 49,
	Philippians: 50,
	Colossians: 51,
	'1 Thessalonians': 52,
	'2 Thessalonians': 53,
	'1 Timothy': 54,
	'2 Timothy': 55,
	Titus: 56,
	Philemon: 57,
	Hebrews: 58,
	James: 59,
	'1 Peter': 60,
	'2 Peter': 61,
	'1 John': 62,
	'2 John': 63,
	'3 John': 64,
	Jude: 65,
	Revelation: 66,
} as Record<string, number>;

export const BibleBookNameAndAbbreviationsMap = {
	Genesis: ['Genesis', 'Gen.', 'Ge.', 'Gn.'],
	Exodus: ['Exodus', 'Ex.', 'Exod.', 'Exo.'],
	Leviticus: ['Leviticus', 'Lev.', 'Le.', 'Lv.'],
	Numbers: ['Numbers', 'Num.', 'Nu.', 'Nm.', 'Nb.'],
	Deuteronomy: ['Deuteronomy', 'Deut.', 'De.', 'Dt.'],
	Joshua: ['Joshua', 'Josh.', 'Jos.', 'Jsh.'],
	Judges: ['Judges', 'Judg.', 'Jdg.', 'Jg.', 'Jdgs.'],
	Ruth: ['Ruth', 'Rth.', 'Ru.'],
	'1 Samuel': [
		'1 Samuel',
		'1 Sam.',
		'1 Sm.',
		'1 Sa.',
		'1 S.',
		'I Sam.',
		'I Sa.',
		'1Sam.',
		'1Sa.',
		'1S.',
		'1st Samuel',
		'1st Sam.',
		'First Samuel',
		'First Sam.',
	],
	'2 Samuel': [
		'2 Samuel',
		'2 Sam.',
		'2 Sm.',
		'2 Sa.',
		'2 S.',
		'II Sam.',
		'II Sa.',
		'2Sam.',
		'2Sa.',
		'2S.',
		'2nd Samuel',
		'2nd Sam.',
		'Second Samuel',
		'Second Sam.',
	],
	'1 Kings': [
		'1 Kings',
		'1 Kings',
		'1 Kgs',
		'1 Ki',
		'1Kgs',
		'1Kin',
		'1Ki',
		'1K',
		'I Kgs',
		'I Ki',
		'1st Kings',
		'1st Kgs',
		'First Kings',
		'First Kgs',
	],
	'2 Kings': [
		'2 Kings',
		'2 Kings',
		'2 Kgs.',
		'2 Ki.',
		'2Kgs.',
		'2Kin.',
		'2Ki.',
		'2K.',
		'II Kgs.',
		'II Ki.',
		'2nd Kings',
		'2nd Kgs.',
		'Second Kings',
		'Second Kgs.',
	],
	'1 Chronicles': [
		'1 Chronicles',
		'1 Chron.',
		'1 Chr.',
		'1 Ch.',
		'1Chron.',
		'1Chr.',
		'1Ch.',
		'I Chron.',
		'I Chr.',
		'I Ch.',
		'1st Chronicles',
		'1st Chron.',
		'First Chronicles',
		'First Chron.',
	],
	'2 Chronicles': [
		'2 Chronicles',
		'2 Chron.',
		'2 Chr.',
		'2 Ch.',
		'2Chron.',
		'2Chr.',
		'2Ch.',
		'II Chron.',
		'II Chr.',
		'II Ch.',
		'2nd Chronicles',
		'2nd Chron.',
		'Second Chronicles',
		'Second Chron.',
	],
	Ezra: ['Ezra', 'Ezra', 'Ezr.', 'Ez.'],
	Nehemiah: ['Nehemiah', 'Neh.', 'Ne.'],
	Esther: ['Esther', 'Est.', 'Esth.', 'Es.'],
	Job: ['Job', 'Job', 'Jb.'],
	Psalms: ['Psalms', 'Ps.', 'Psalm', 'Pslm.', 'Psa.', 'Psm.', 'Pss.'],
	Proverbs: ['Proverbs', 'Prov', 'Pro.', 'Prv.', 'Pr.'],
	Ecclesiastes: ['Ecclesiastes', 'Eccles.', 'Eccle.', 'Ecc.', 'Ec.', 'Qoh.'],
	'Song of Solomon': [
		'Song of Solomon',
		'Song',
		'Song of Songs',
		'SOS.',
		'So.',
		'Canticle of Canticles',
		'Canticles',
		'Cant.',
	],
	Isaiah: ['Isaiah', 'Isa.', 'Is.'],
	Jeremiah: ['Jeremiah', 'Jer.', 'Je.', 'Jr.'],
	Lamentations: ['Lamentations', 'Lam.', 'La.'],
	Ezekiel: ['Ezekiel', 'Ezek.', 'Eze.', 'Ezk.'],
	Daniel: ['Daniel', 'Dan.', 'Da.', 'Dn.'],
	Hosea: ['Hosea', 'Hos.', 'Ho.'],
	Joel: ['Joel', 'Joel', 'Jl.'],
	Amos: ['Amos', 'Amos', 'Am.'],
	Obadiah: ['Obadiah', 'Obad.', 'Ob.'],
	Jonah: ['Jonah', 'Jonah', 'Jnh.', 'Jon.'],
	Micah: ['Micah', 'Mic.', 'Mc.'],
	Nahum: ['Nahum', 'Nah.', 'Na.'],
	Habakkuk: ['Habakkuk', 'Hab.', 'Hb.'],
	Zephaniah: ['Zephaniah', 'Zeph.', 'Zep.', 'Zp.'],
	Haggai: ['Haggai', 'Hag.', 'Hg.'],
	Zechariah: ['Zechariah', 'Zech.', 'Zec.', 'Zc.'],
	Malachi: ['Malachi', 'Mal.', 'Ml.'],
	Matthew: ['Matthew', 'Matt.', 'Mt.'],
	Mark: ['Mark', 'Mark', 'Mrk', 'Mar', 'Mk', 'Mr'],
	Luke: ['Luke', 'Luke', 'Luk', 'Lk'],
	John: ['John', 'John', 'Joh', 'Jhn', 'Jn'],
	Acts: ['Acts', 'Acts', 'Act', 'Ac'],
	Romans: ['Romans', 'Rom.', 'Ro.', 'Rm.'],
	'1 Corinthians': [
		'1 Corinthians',
		'1 Cor.',
		'1 Co.',
		'I Cor.',
		'I Co.',
		'1Cor.',
		'1Co.',
		'I Corinthians',
		'1Corinthians',
		'1st Corinthians',
		'First Corinthians',
	],
	'2 Corinthians': [
		'2 Corinthians',
		'2 Cor.',
		'2 Co.',
		'II Cor.',
		'II Co.',
		'2Cor.',
		'2Co.',
		'II Corinthians',
		'2Corinthians',
		'2nd Corinthians',
		'Second Corinthians',
	],
	Galatians: ['Galatians', 'Gal.', 'Ga.'],
	Ephesians: ['Ephesians', 'Eph.', 'Ephes.'],
	Philippians: ['Philippians', 'Phil.', 'Php.', 'Pp.'],
	Colossians: ['Colossians', 'Col.', 'Co.'],
	'1 Thessalonians': [
		'1 Thessalonians',
		'1 Thess.',
		'1 Thes.',
		'1 Th.',
		'I Thessalonians',
		'I Thess.',
		'I Thes.',
		'I Th.',
		'1Thessalonians',
		'1Thess.',
		'1Thes.',
		'1Th.',
		'1st Thessalonians',
		'1st Thess.',
		'First Thessalonians',
		'First Thess.',
	],
	'2 Thessalonians': [
		'2 Thessalonians',
		'2 Thess.',
		'2 Thes.',
		'2 Th.',
		'II Thessalonians',
		'II Thess.',
		'II Thes.',
		'II Th.',
		'2Thessalonians',
		'2Thess.',
		'2Thes.',
		'2Th.',
		'2nd Thessalonians',
		'2nd Thess.',
		'Second Thessalonians',
		'Second Thess.',
	],
	'1 Timothy': [
		'1 Timothy',
		'1 Tim.',
		'1 Ti.',
		'I Timothy',
		'I Tim.',
		'I Ti.',
		'1Timothy',
		'1Tim.',
		'1Ti.',
		'1st Timothy',
		'1st Tim.',
		'First Timothy',
		'First Tim.',
	],
	'2 Timothy': [
		'2 Timothy',
		'2 Tim.',
		'2 Ti.',
		'II Timothy',
		'II Tim.',
		'II Ti.',
		'2Timothy',
		'2Tim.',
		'2Ti.',
		'2nd Timothy',
		'2nd Tim.',
		'Second Timothy',
		'Second Tim.',
	],
	Titus: ['Titus', 'Titus', 'Tit', 'ti'],
	Philemon: ['Philemon', 'Philem.', 'Phm.', 'Pm.'],
	Hebrews: ['Hebrews', 'Heb.'],
	James: ['James', 'James', 'Jas', 'Jm'],
	'1 Peter': [
		'1 Peter',
		'1 Pet.',
		'1 Pe.',
		'1 Pt.',
		'1 P.',
		'I Pet.',
		'I Pt.',
		'I Pe.',
		'1Peter',
		'1Pet.',
		'1Pe.',
		'1Pt.',
		'1P.',
		'I Peter',
		'1st Peter',
		'First Peter',
	],
	'2 Peter': [
		'2 Peter',
		'2 Pet.',
		'2 Pe.',
		'2 Pt.',
		'2 P.',
		'II Peter',
		'II Pet.',
		'II Pt.',
		'II Pe.',
		'2Peter',
		'2Pet.',
		'2Pe.',
		'2Pt.',
		'2P.',
		'2nd Peter',
		'Second Peter',
	],
	'1 John': [
		'1 John',
		'1 John',
		'1 Jhn.',
		'1 Jn.',
		'1 J.',
		'1John',
		'1Jhn.',
		'1Joh.',
		'1Jn.',
		'1Jo.',
		'1J.',
		'I John',
		'I Jhn.',
		'I Joh.',
		'I Jn.',
		'I Jo.',
		'1st John',
		'First John',
	],
	'2 John': [
		'2 John',
		'2 John',
		'2 Jhn.',
		'2 Jn.',
		'2 J.',
		'2John',
		'2Jhn.',
		'2Joh.',
		'2Jn.',
		'2Jo.',
		'2J.',
		'II John',
		'II Jhn.',
		'II Joh.',
		'II Jn.',
		'II Jo.',
		'2nd John',
		'Second John',
	],
	'3 John': [
		'3 John',
		'3 John',
		'3 Jhn.',
		'3 Jn.',
		'3 J.',
		'3John',
		'3Jhn.',
		'3Joh.',
		'3Jn.',
		'3Jo.',
		'3J.',
		'III John',
		'III Jhn.',
		'III Joh.',
		'III Jn.',
		'III Jo.',
		'3rd John',
		'Third John',
	],
	Jude: ['Jude', 'Jude', 'Jud.', 'Jd.'],
	Revelation: ['Revelation', 'Rev', 'Re', 'The Revelation'],
};

export const BibleVersion = {
	KJV: 'kjv' as const,
} as const;
export type BibleVersion = (typeof BibleVersion)[keyof typeof BibleVersion];

const allBooksAndAbbreviations = Object.values(
	BibleBookNameAndAbbreviationsMap,
).flatMap((abbreviations) =>
	// make "."" optional
	abbreviations.map((abbreviation) => abbreviation.replace(/\./g, '.?')),
);

// dont even try to understand this regex
// but basically
//  1. matches an optional version
//  2. matches a book name or abbreviation
//  3. matches an optional chapter and verse
//  4. matches an optional version yet again
//  5. case insensitive
// eg. "Genesis 1:1 KJV" or "KJV Genesis 1:1" or "Gen 1:1" or "gen 1 1" etc.
export const bibleSearchRegex = new RegExp(
	`^(?:(${Object.values(BibleVersion).join('|')})\\s+)?(${allBooksAndAbbreviations.join(
		'|',
	)})(?:\\s+(?:(\\d+)(?:(?:[:"]\\s*|\\s+)(\\d+))?)?)?(?:\\s+(${Object.values(BibleVersion).join('|')}))?$`,
	'i',
);