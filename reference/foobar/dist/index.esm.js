const Arrays = {
  'arr empty': [],
  'arr zero': [0],
  'arr one': [1],
  'arr misc': [16, 64, 128]
};

// const { random } = Math
const {
  random,
  abs,
  exp,
  log,
  sqrt,
  pow,
  cos,
  sin,
  PI
} = Math;

const randIdx = arr => ~~(random() * arr.length);

const randSel = arr => arr[randIdx(arr)];

const R0 = 3.442619855899;
const R1 = 1.0 / R0;
const R0S = exp(-0.5 * R0 * R0);
const N2P32 = -pow(2, 32);
const M1 = 2147483648.0;
const VN = 9.91256303526217e-3;

class Ziggurat {
  constructor(mean = 0, stdev = 1) {
    this.jsr = 123456789;
    this.wn = Array(128);
    this.fn = Array(128);
    this.kn = Array(128);
    this.mean = mean;
    this.stdev = stdev;
    this.preset();
  }

  preset() {
    // seed generator based on current time
    this.jsr ^= new Date().getTime();
    let m1 = M1,
        dn = R0,
        tn = R0,
        vn = VN,
        q = vn / R0S;
    this.kn[0] = ~~(dn / q * m1);
    this.kn[1] = 0;
    this.wn[0] = q / m1;
    this.wn[127] = dn / m1;
    this.fn[0] = 1.0;
    this.fn[127] = R0S;

    for (let i = 126; i >= 1; i--) {
      dn = sqrt(-2.0 * log(vn / dn + exp(-0.5 * dn * dn)));
      this.kn[i + 1] = ~~(dn / tn * m1);
      tn = dn;
      this.fn[i] = exp(-0.5 * dn * dn);
      this.wn[i] = dn / m1;
    }
  }

  next() {
    return this.randSample() * this.stdev + this.mean;
  }

  nextInt() {
    return Math.round(this.next());
  }

  randSample() {
    let hz = this.xorshift(),
        iz = hz & 127;
    return abs(hz) < this.kn[iz] ? hz * this.wn[iz] : this.nfix(hz, iz);
  }

  nfix(hz, iz) {
    let r = R0,
        x,
        y;

    while (true) {
      x = hz * this.wn[iz];

      if (iz === 0) {
        do {
          x = -log(this.uni()) * R1;
          y = -log(this.uni());
        } while (y + y < x * x); // {
        //   x = -log(this.uni()) * r1
        //   y = -log(this.uni())
        // }


        return hz > 0 ? r + x : -r - x;
      }

      if (this.fn[iz] + this.uni() * (this.fn[iz - 1] - this.fn[iz]) < exp(-0.5 * x * x)) return x;
      hz = this.xorshift();
      iz = hz & 127;
      if (abs(hz) < this.kn[iz]) return hz * this.wn[iz];
    }
  }

  xorshift() {
    let m = this.jsr,
        n = m;
    n ^= n << 13;
    n ^= n >>> 17;
    n ^= n << 5;
    this.jsr = n;
    return m + n | 0;
  }

  uni() {
    return 0.5 + this.xorshift() / N2P32;
  }

}

class Roulett {
  /**
   * From [min, max] return a random integer.
   * Of [min, max], both min and max are inclusive.
   * @param {number} min(inclusive) - int
   * @param {number} max(inclusive) - int
   * @returns {number} int
   */
  static between(min, max) {
    return ~~(random() * (max - min + 1)) + min;
  }
  /**
   * From [min, max) return a random integer.
   * Of [min, max), min is inclusive but max is exclusive.
   * @param {number} min(inclusive) - int
   * @param {number} max(exclusive) - int
   * @returns {number} int
   */


  static rand(min, max) {
    return ~~(random() * (max - min)) + min;
  }

  static index(len) {
    return ~~(random() * len);
  }

  static arrayIndex(arr) {
    return randIdx(arr);
  }

  static element(arr) {
    return randSel(arr);
  }

  static key(obj) {
    return randSel(Object.keys(obj));
  }

  static value(obj) {
    return randSel(Object.values(obj));
  }

  static entry(obj) {
    return randSel(Object.entries(obj));
  }
  /**
   * Return an array of random number that follows gaussian distribution(normal distribution).
   * @param {number} len - length of the returned array
   * @param {number} mean - mean
   * @param {number} stdev - standard deviation
   * @returns {number[]}
   */


  static gaussSamples(len, mean = 0, stdev = 1) {
    const z = new Ziggurat(mean, stdev),
          arr = Array(len);

    for (let i = 0; i < len; i++) arr[i] = z.next();

    return arr;
  }

}

const RAND = 0,
      HEAD = 1,
      TAIL = 2,
      LEAP = 3;
const {
  index: randIndex
} = Roulett;

const randShuffleVector = (ar, size) => {
  const l = ar.length,
        vec = Array(size = Math.min(size, l));

  for (let i = 0, set = new Set(), rand; i < size; i++) {
    do {
      var _l;

      rand = (_l = l, randIndex(_l));
    } while (set.has(rand));

    set.add(rand);
    vec[i] = ar[rand];
  }

  return vec;
};

const leapShuffleVector = (ar, {
  min,
  dif
}) => {
  const l = ar.length,
        vec = Array(dif = Math.min(dif, l));
  min = min || Roulett.rand(0, l);

  for (let i = min, j = 0; i < min + dif; i++) vec[j++] = ar[i < l ? i : i % l];

  return vec;
};

function shuffleVector(ar) {
  let {
    mode,
    size,
    start
  } = this;
  start = start || Roulett.rand(0, ar && ar.length);
  size = size || 3;

  switch (mode || RAND) {
    case RAND:
      return randShuffleVector(ar, size);

    case LEAP:
      return leapShuffleVector(ar, {
        min: start,
        dif: size
      });

    case HEAD:
      return ar.slice(0, size);

    case TAIL:
      return ar.slice(-size);
  }
}

const {
  index: randIndex$1
} = Roulett;

const randShuffleObject = (ob, size) => {
  const keys = Object.keys(ob),
        l = keys.length;
  size = Math.min(l, size);
  const o = {};

  for (let i = 0, set = new Set(), rand, key; i < size; i++) {
    do {
      var _l;

      rand = (_l = l, randIndex$1(_l));
    } while (set.has(rand));

    set.add(rand);
    o[key = keys[rand]] = ob[key];
  }

  return o;
};

const leapShuffleObject = (ob, {
  min,
  dif
}) => {
  const keys = Object.keys(ob),
        l = keys.length,
        o = {};
  min = min || Roulett.rand(0, l);
  dif = Math.min(dif, l);

  for (let i = min, key; i < min + dif; i++) {
    o[key = keys[i < l ? i : i % l]] = ob[key];
  }

  return o;
};

function shuffleObject(ob) {
  let {
    mode,
    size,
    start
  } = this;
  let keys = Object.keys(ob),
      o;
  start = start || Roulett.rand(0, keys && keys.length);
  size = size || 3;

  switch (mode || RAND) {
    case RAND:
      return randShuffleObject(ob, size);

    case LEAP:
      return leapShuffleObject(ob, {
        min: start,
        dif: size
      });

    case HEAD:
      o = {};
      keys.slice(0, size).forEach(key => o[key] = ob[key]);
      return keys;

    case TAIL:
      o = {};
      keys.slice(-size).forEach(key => o[key] = ob[key]);
      return keys;
  }
}

function shuffle(o) {
  return Array.isArray(o) ? shuffleVector.call(this, o) : shuffleObject.call(this, o);
}

const Shuffler = ({
  mode,
  size,
  start
}) => shuffle.bind({
  mode,
  size,
  start
});

const allPropKeys = candidates => Reflect.ownKeys(candidates).filter(p => typeof candidates[p] === 'object').slice(1);

const flopPropKey = candidates => {
  var _ref, _candidates;

  return _ref = (_candidates = candidates, allPropKeys(_candidates)), Roulett.element(_ref);
};

const allFuncKeys = candidates => Reflect.ownKeys(candidates).filter(p => typeof candidates[p] === 'function');

function flopShuffleProp(o) {
  var _o;

  let {
    p,
    mode,
    size,
    start,
    keyValuePair
  } = this;
  p = p || (_o = o, flopPropKey(_o));
  const shuffled = shuffle.call({
    mode,
    size,
    start
  }, o[p]);
  let ro;
  return keyValuePair ? (ro = {}, ro[p] = shuffled, ro) : shuffled;
}

class Flopper {
  static flop({
    p,
    mode,
    size,
    start,
    keyValuePair
  } = {}) {
    return flopShuffleProp.call({
      p,
      mode,
      size,
      start,
      keyValuePair
    }, this);
  }

}

const actors = ['Jeremy', 'Kevin', 'Robert', 'Gérard', 'Richard', 'Anthony', 'Warren', 'Robert', 'Nick', 'Robin', 'Al', 'Robert', 'Clint', 'Stephen', 'Denzel', 'Tom', 'Daniel', 'Laurence', 'Anthony', 'Liam', 'Tom', 'Morgan', 'Nigel', 'Paul', 'John', 'Nicolas', 'Richard', 'Anthony', 'Sean', 'Massimo', 'Geoffrey', 'Tom', 'Ralph', 'Woody', 'Billy', 'Jack', 'Matt', 'Robert', 'Peter', 'Dustin', 'Roberto', 'Tom', 'Ian', 'Nick', 'Edward', 'Kevin', 'Russell', 'Richard', 'Sean', 'Denzel', 'Russell', 'Javier', 'Tom', 'Ed', 'Geoffrey', 'Denzel', 'Russell', 'Sean', 'Will', 'Tom', 'Adrien', 'Nicolas', 'Michael', 'Daniel', 'Jack', 'Sean', 'Johnny', 'Ben', 'Jude', 'Bill', 'Jamie', 'Don', 'Johnny', 'Leonardo', 'Clint', 'Philip', 'Terrence', 'Heath', 'Joaquin', 'David', 'Forest', 'Leonardo', 'Ryan', 'Peter', 'Will', 'Daniel', 'George', 'Johnny', 'Tommy', 'Viggo', 'Sean', 'Richard', 'Frank', 'Brad', 'Mickey', 'Jeff', 'George', 'Colin', 'Morgan', 'Jeremy'];
const actresses = ['Kathy', 'Anjelica', 'Julia', 'Meryl', 'Joanne', 'Jodie', 'Geena', 'Laura', 'Bette', 'Susan', 'Emma', 'Catherine', 'Mary', 'Michelle', 'Susan', 'Holly', 'Angela', 'Stockard', 'Emma', 'Debra', 'Jessica', 'Jodie', 'Miranda', 'Winona', 'Susan', 'Susan', 'Elisabeth', 'Sharon', 'Meryl', 'Emma', 'Frances', 'Brenda', 'Diane', 'Kristin', 'Emily', 'Helen', 'Helena', 'Julie', 'Judi', 'Kate', 'Gwyneth', 'Cate', 'Fernanda', 'Meryl', 'Emily', 'Hilary', 'Annette', 'Janet', 'Julianne', 'Meryl', 'Julia', 'Joan', 'Juliette', 'Ellen', 'Laura', 'Halle', 'Judi', 'Nicole', 'Sissy', 'Renée', 'Nicole', 'Salma', 'Diane', 'Julianne', 'Renée', 'Charlize', 'Keisha', 'Diane', 'Samantha', 'Naomi', 'Hilary', 'Annette', 'Catalina', 'Imelda', 'Kate', 'Reese', 'Judi', 'Felicity', 'Keira', 'Charlize', 'Helen', 'Penélope', 'Judi', 'Meryl', 'Kate', 'Marion', 'Cate', 'Julie', 'Laura', 'Ellen', 'Kate', 'Anne', 'Angelina', 'Melissa', 'Meryl', 'Sandra', 'Helen', 'Carey', 'Gabourey', 'Meryl'];
const directors = ['Kevin', 'Francis', 'Stephen', 'Barbet', 'Martin', 'Jonathan', 'Barry', 'Ridley', 'John', 'Oliver', 'Clint', 'Robert', 'Martin', 'James', 'Neil', 'Steven', 'Robert', 'Jane', 'James', 'Jim', 'Robert', 'Woody', 'Krzysztof', 'Robert', 'Quentin', 'Mel', 'Mike', 'Chris', 'Michael', 'Tim', 'Anthony', 'Joel', 'Miloš', 'Scott', 'Mike', 'James', 'Peter', 'Atom', 'Curtis', 'Gus', 'Steven', 'Roberto', 'John', 'Terrence', 'Peter', 'Sam', 'Lasse', 'Spike', 'Michael', 'M', 'Steven', 'Stephen', 'Ang', 'Ridley', 'Steven', 'Ron', 'Robert', 'Peter', 'David', 'Roman', 'Ridley', 'Pedro', 'Stephen', 'Rob', 'Peter', 'Martin', 'Sofia', 'Clint', 'Fernando', 'Peter', 'Clint', 'Taylor', 'Mike', 'Alexander', 'Martin', 'Ang', 'George', 'Paul', 'Bennett', 'Steven', 'Martin', 'Clint', 'Stephen', 'Alejandro', 'Paul', 'Joel', 'Ethan', 'Paul', 'Tony', 'Jason', 'Julian', 'Danny', 'Stephen', 'David', 'Ron', 'Gus', 'James', 'Kathryn', 'Lee', 'Jason', 'Quentin'];

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const namesToBrief = names => names.map(name => {
  name = name.split(' ');
  let last = '';

  do {
    last = name.pop() + last;
  } while (last === 'Jr.');

  return name.map(([initial]) => initial + '.').join('') + last;
}); // in millions USD


const ArmSales = {
  LockheedMartin: 47260,
  Boeing: 29150,
  NorthropGrumman: 26190,
  Raytheon: 23440,
  GeneralDynamics: 22000,
  BAESystemsUK: 21210,
  AirbusGroup: 11650,
  BAESystemsUS: 10800,
  Leonardo: 9820,
  AlmazAntey: 9640,
  Thales: 9470,
  UnitedTechnologies: 9310,
  L3Technologies: 8250,
  HuntingtonIngallsInd: 7200,
  HoneywellIntr: 5430,
  UnitedAircraft: 5420,
  Leidos: 5000,
  Harris: 4970,
  UnitedShipbuilding: 4700,
  BoozAllenHamilton: 4680,
  RollsRoyce: 4680,
  NavalGroup: 4220,
  Rheinmetall: 3800,
  MBDA: 3780,
  GeneralElectric: 3650,
  MitsubishiHeavyInd: 3620,
  TacticalMissiles: 3600,
  Textron: 3500,
  ElbitSystems: 3500,
  CACIIntr: 3490,
  Saab: 3240,
  Safran: 3240,
  Sandia: 3200,
  BabcockIntr: 3180,
  UnitedEngine: 2950,
  DassaultAviation: 2930,
  ScienceApplicationsIntr: 2800,
  AECOM: 2770,
  GeneralAtomics: 2750,
  HindustanAeronautics: 2740,
  AirbusHelicoptersInc: 2730,
  IsraelAerospaceInd: 2650,
  HighPrecisionSystems: 2630,
  RockwellCollins: 2630,
  KBR: 2600,
  Perspecta: 2590,
  Rafael: 2540,
  RussianElectronics: 2330,
  HanwhaAerospace: 2320,
  CEA: 2300,
  KawasakiHeavyInd: 2260,
  BellHelicopterTextron: 2030,
  Bechtel: 2000,
  Fincantieri: 1900,
  Oshkosh: 1850,
  RussianHelicopters: 1810,
  KRET: 1770,
  ASELSAN: 1740,
  KraussMaffeiWegmann: 1680,
  IndianOrdnanceFactories: 1650,
  ThyssenKrupp: 1650,
  Cobham: 1590,
  DynCorpIntr: 1560,
  KoreaAerospaceInd: 1550,
  STEngineering: 1540,
  BharatElectronics: 1460,
  ManTechIntr: 1430,
  UralVagonZavod: 1370,
  JacobsEngineering: 1370,
  Fluor: 1350,
  LIGNex1: 1340,
  TransDigm: 1330,
  GKN: 1320,
  MelroseInd: 1320,
  UnitedLaunchAlliance: 1320,
  UkrOboronProm: 1300,
  Fujitsu: 1270,
  SercoGroup: 1260,
  PGZ: 1250,
  TeledyneTechnologies: 1240,
  Navantia: 1240,
  Hensoldt: 1240,
  Vectrus: 1230,
  AerojetRocketdyne: 1220,
  AustalUSA: 1160,
  Austal: 1140,
  SierraNevada: 1100,
  IHI: 1090,
  Nexter: 1080,
  TurkishAerospaceInd: 1070,
  BWXTechnologies: 1070,
  Engility: 1070,
  CAE: 1010,
  MIT: 980,
  Meggitt: 970,
  CurtissWright: 970,
  TheAerospace: 970,
  DevonportRoyalDockyard: 940,
  Ball: 930,
  Moog: 920,
  QinetiQ: 910,
  RUAG: 900,
  ViaSat: 860,
  MitsubishiElectric: 860,
  Arconic: 840,
  NEC: 840,
  Amphenol: 820
};
const BrentPrices = {
  '2020': 61.25,
  '2019': 64.37,
  '2018': 71.34,
  '2017': 54.13,
  '2016': 43.64,
  '2015': 52.32,
  '2014': 98.97,
  '2013': 108.56,
  '2012': 111.63,
  '2011': 111.26,
  '2010': 79.61,
  '2009': 61.74,
  '2008': 96.94,
  '2007': 72.44,
  '2006': 65.16,
  '2005': 54.57,
  '2004': 38.26,
  '2003': 28.85,
  '2002': 24.99,
  '2001': 24.46,
  '2000': 28.66,
  '1999': 17.90,
  '1998': 12.76,
  '1997': 19.11,
  '1996': 20.64,
  '1995': 17.02,
  '1994': 15.86,
  '1993': 17.01,
  '1992': 19.32,
  '1991': 20.04,
  '1990': 23.76,
  '1989': 18.23,
  '1988': 14.91,
  '1987': 18.53
};
const CityPopulations = {
  PearlRiverDelta: 46.7,
  Tokyo: 40.4,
  Shanghai: 33.6,
  Jakarta: 31.3,
  Delhi: 30.3,
  Manila: 25.7,
  Bombay: 25.1,
  Seoul: 24.8,
  MexicoCity: 23.0,
  SãoPaulo: 22.4,
  NewYork: 22.1,
  Cairo: 21.0,
  Dacca: 20.2,
  Beijing: 19.8,
  Lagos: 19.4,
  Bangkok: 18.8,
  Karachi: 17.8,
  LosAngeles: 17.7,
  Osaka: 17.7,
  Moscow: 17.3,
  Calcutta: 16.8,
  BuenosAires: 16.4,
  Istanbul: 16.0,
  Tehran: 15.3,
  London: 14.8,
  Johannesburg: 13.9,
  RiodeJaneiro: 13.2,
  Lahore: 13.0,
  Tientsin: 12.7,
  Kinshasa: 12.4,
  Bangalore: 12.2,
  Paris: 11.4,
  Madras: 11.3,
  Nagoya: 10.5,
  HyderabadIndia: 10.2,
  Lima: 10.1,
  Xiamen: 10.0,
  Chicago: 9.8,
  Bogotá: 9.6,
  Chengtu: 9.6,
  Taipei: 9.2,
  Wuhan: 9.1,
  KualaLumpur: 8.9,
  Saigon: 8.6,
  Washington: 8.6,
  Ahmedabad: 8.5,
  Hangchou: 8.5,
  Chungking: 8.2,
  Luanda: 8.2,
  Riyadh: 8.1,
  Shenyang: 8.0,
  Singapore: 7.9,
  SanFrancisco: 7.9,
  Boston: 7.8,
  Shantou: 7.7,
  HongKong: 7.5,
  Toronto: 7.5,
  Philadelphia: 7.4,
  Santiago: 7.3,
  Dallas: 7.2,
  Baghdad: 7.0,
  Bandung: 7.0,
  Sian: 7.0,
  Poona: 6.9,
  Houston: 6.8,
  Nanking: 6.6,
  Surat: 6.6,
  Madrid: 6.6,
  DaresSalaam: 6.5,
  Miami: 6.4,
  Khartoum: 6.3,
  Milan: 6.2,
  Tsingtao: 6.1,
  Surabaya: 6.1,
  Nairobi: 5.9,
  Atlanta: 5.9,
  Alexandria: 5.8,
  Detroit: 5.8,
  TheRuhr: 5.7,
  SaintPetersburg: 5.7,
  Abidjan: 5.6,
  Amman: 5.6,
  Rangoon: 5.6,
  Dubai: 5.4,
  Guadalajara: 5.4,
  Wenzhou: 5.4,
  Sydney: 5.3,
  Accra: 5.1,
  Harbin: 5.1,
  Ankara: 5.1,
  BeloHorizonte: 5.0,
  CologneDusseldorf: 5.0,
  Monterrey: 5.0,
  MelbourneAus: 5.0,
  Hofei: 5.0,
  Jeddah: 5.0,
  Zhengzhou: 5.0,
  Changsha: 4.9,
  Chittagong: 4.9,
  Barcelona: 4.8,
  KuwaitCity: 4.8,
  Colombo: 4.8,
  Berlin: 4.7,
  Kano: 4.7,
  Phoenix: 4.7,
  Shijiazhuang: 4.6,
  Dairen: 4.6,
  Casablanca: 4.5,
  Jinan: 4.5,
  Seattle: 4.4,
  Tampa: 4.4,
  Kabul: 4.3,
  Kunming: 4.3,
  CapeTown: 4.2,
  Montreal: 4.2,
  Naples: 4.2,
  Pusan: 4.1,
  PortoAlegre: 4.1,
  Taiyuan: 4.1,
  Ürümqi: 4.1,
  Fuzhou: 4.0,
  Medellín: 4.0,
  Brasília: 4.0,
  Medan: 4.0,
  SantoDomingo: 4.0,
  Algiers: 4.0,
  Jaipur: 4.0,
  Nanchang: 3.9,
  Recife: 3.9,
  Damascus: 3.8,
  AddisAbaba: 3.8,
  Hanoi: 3.8,
  Caracas: 3.8,
  Denver: 3.8,
  Dakar: 3.7,
  Lucknow: 3.7,
  Changchun: 3.7,
  Fortaleza: 3.7,
  Faisalabad: 3.7,
  Salvador: 3.6,
  Ibadan: 3.6,
  Rome: 3.6,
  Abuja: 3.5,
  Bamako: 3.5,
  Kampala: 3.5,
  Zibo: 3.5,
  Kanpur: 3.5,
  Kiev: 3.5,
  Nanning: 3.5,
  Orlando: 3.5,
  Rawalpindi: 3.5,
  Yaoundé: 3.5,
  Curitiba: 3.4,
  Durban: 3.4,
  Douala: 3.4,
  Athens: 3.4,
  SanDiego: 3.4,
  Guiyang: 3.3,
  Nagpur: 3.3,
  Ningbo: 3.3,
  FrankfurtamMain: 3.3,
  Rotterdam: 3.3,
  PortAuPrince: 3.2,
  Tashkent: 3.2,
  Campinas: 3.2,
  Isfahan: 3.2,
  Meshed: 3.2,
  Indore: 3.2,
  Minneapolis: 3.2,
  Puebla: 3.2,
  Birmingham: 3.2,
  Brisbane: 3.2,
  GuatemalaCity: 3.2,
  Guayaquil: 3.2,
  Kathmandu: 3.1,
  Cleveland: 3.1,
  Manchester: 3.1,
  Izmir: 3.0,
  Kumasi: 3.0,
  Pyongyang: 3.0,
  Bhilai: 2.9,
  Lanzhou: 2.9,
  Cali: 2.9,
  Hamburg: 2.9,
  Tangshan: 2.9,
  Vancouver: 2.9,
  Xuzhou: 2.9,
  Huizhou: 2.8,
  Sana_a: 2.8,
  Cincinnati: 2.8,
  Kaohsiung: 2.8,
  Gujranwala: 2.8,
  Taegu: 2.8,
  Fukuoka: 2.8,
  Cebu: 2.7,
  Quito: 2.7,
  Brussels: 2.7,
  Coimbatore: 2.7,
  TelAviv_Jaffa: 2.7,
  Lusaka: 2.7,
  Patna: 2.7,
  Tunis: 2.7,
  Anshan: 2.6,
  Budapest: 2.6,
  Maracaibo: 2.6,
  Ouagadougou: 2.6,
  Baku: 2.6,
  Luoyang: 2.6,
  Conakry: 2.5,
  Dammam: 2.5,
  Sapporo: 2.5,
  Amsterdam: 2.5,
  Charlotte: 2.5,
  Jiangyin: 2.5,
  Lisbon: 2.5,
  SaltLakeCity: 2.5,
  Doha: 2.4,
  Bhopal: 2.4,
  Goiânia: 2.4,
  Portland: 2.4,
  Taichung: 2.4,
  Stuttgart: 2.4,
  SanJosé: 2.4,
  Warsaw: 2.4,
  Asunción: 2.4,
  Chandigarh: 2.4,
  Katowice: 2.4,
  Peshawar: 2.4,
  PortHarcourt: 2.4,
  StLouis: 2.4,
  Toluca: 2.3,
  Agra: 2.3,
  Taizhou: 2.3,
  HyderabadPakistan: 2.3,
  LasVegas: 2.3,
  Maputo: 2.3,
  Brazzaville: 2.3,
  Munich: 2.3,
  Semarang: 2.3,
  Vienna: 2.3,
  Baotou: 2.2,
  Belém: 2.2,
  Havana: 2.2,
  SanAntonio: 2.2,
  Stockholm: 2.2,
  Vadodara: 2.2,
  Bucharest: 2.2,
  Lubumbashi: 2.2,
  Manaus: 2.2,
  Okayama: 2.2,
  Vishakhapatnam: 2.2,
  Yantai: 2.2,
  Leeds: 2.2,
  SantaCruz: 2.2,
  GeorgeTown: 2.1,
  LaPaz: 2.1,
  Mecca: 2.1,
  Xinxiang: 2.1,
  Alma_Ata: 2.1,
  Barranquilla: 2.1,
  Lomé: 2.1,
  Multan: 2.1,
  Baoding: 2.1,
  Bursa: 2.1,
  Mbuji_Mayi: 2.1,
  Nasik: 2.1,
  Perth: 2.1,
  PhnomPenh: 2.1,
  Sacramento: 2.1,
  Harare: 2.1,
  Linyi: 2.1,
  Pittsburgh: 2.1,
  Rabat: 2.1,
  Cixi: 2.0,
  Indianapolis: 2.0,
  Kitakyushu: 2.0,
  Liuzhou: 2.0,
  Minsk: 2.0,
  ValenciaVenuezuela: 2.0,
  Vijayawada: 2.0,
  KansasCity: 2.0,
  Nantong: 2.0,
  Weifang: 2.0,
  Huai_an: 2.0,
  Ludhiana: 2.0,
  Lyon: 2.0,
  Tijuana: 2.0,
  Austin: 2.0,
  Gaza: 2.0,
  Yangzhou: 2.0,
  León: 1.9,
  Mogadishu: 1.9,
  Benares: 1.9,
  Yogyakarta: 1.9,
  Huainan: 1.9,
  SanJuan: 1.9,
  Aleppo: 1.9,
  Bhubaneswar: 1.9,
  SanSalvador: 1.9,
  Makassar: 1.9,
  Rajkot: 1.9,
  Hiroshima: 1.9,
  Kaduna: 1.9,
  Liverpool: 1.9,
  Xiangyang: 1.9,
  Hohhot: 1.9,
  Haikou: 1.9,
  Montevideo: 1.9,
  Vitória: 1.9,
  ValenciaSpain: 1.8,
  Cotonou: 1.8,
  Tabriz: 1.8,
  Aurangabad: 1.8,
  Freetown: 1.8,
  Madurai: 1.8,
  Shiraz: 1.8,
  Columbus: 1.8,
  Beirut: 1.8,
  Malang: 1.8,
  Zhuhai: 1.8,
  Adana: 1.7,
  Meerut: 1.7,
  Santos: 1.7,
  NizhnyNovgorod: 1.7,
  Palembang: 1.7,
  Anyang: 1.7,
  Hartford: 1.7,
  Hengyang: 1.7,
  Novosibirsk: 1.7,
  Glasgow: 1.7,
  Copenhagen: 1.7,
  Córdoba: 1.7,
  Gaziantep: 1.7,
  Handan: 1.7,
  Jamshedpur: 1.7,
  Yekaterinburg: 1.7,
  Marseille: 1.7,
  Raleigh: 1.7,
  Yiwu: 1.7,
  BeninCity: 1.7,
  Datong: 1.7,
  Kharkiv: 1.6,
  Turin: 1.6,
  Surakarta: 1.6,
  Daqing: 1.6,
  Āsansol: 1.6,
  VirginiaBeach: 1.6,
  Kwangju: 1.6,
  Srinagar: 1.6,
  Cochin: 1.6,
  Monrovia: 1.6,
  Mannheim: 1.6,
  Davao: 1.6,
  Sheffield: 1.6,
  Guilin: 1.6,
  Mandalay: 1.6,
  Denpasar: 1.6,
  Milwaukee: 1.6,
  Medina: 1.5,
  Bengbu: 1.5,
  PanamaCity: 1.5,
  Taejon: 1.5,
  Jilin: 1.5,
  Porto: 1.5,
  Manama: 1.5,
  Basra: 1.5,
  Huaibei: 1.5,
  Xingtai: 1.5,
  AbuDhabi: 1.5,
  Calgary: 1.5,
  CiudadJuárez: 1.5,
  Ganzhou: 1.5,
  Sendai: 1.5,
  Yerevan: 1.5,
  Angeles: 1.5,
  Jabalpur: 1.5,
  Jodhpur: 1.5,
  Nashville: 1.5,
  Newcastle: 1.5,
  Oran: 1.5,
  Wuhu: 1.5,
  Zhangjiakou: 1.5,
  Jiaozuo: 1.5,
  Yinchuan: 1.5,
  Allahabad: 1.5,
  Xining: 1.5,
  Jacksonville: 1.5,
  Tai_an: 1.5,
  Donetsk: 1.4,
  Prague: 1.4,
  Querétaro: 1.4,
  SãoLuís: 1.4,
  Muscat: 1.4,
  Ranchi: 1.4,
  Zurich: 1.4,
  Belgrade: 1.4,
  Maoming: 1.4,
  Maracay: 1.4,
  Yancheng: 1.4,
  Auckland: 1.4,
  Chelyabinsk: 1.4,
  Cochabamba: 1.4,
  Natal: 1.4,
  Ndjamena: 1.4,
  Volgograd: 1.4,
  Mosul: 1.4,
  Amritsar: 1.4,
  Gwalior: 1.4,
  Tirupur: 1.4,
  UlanBator: 1.4,
  Xiangtan: 1.4,
  Ashgabat: 1.4,
  Batam: 1.4,
  Dnepropetrovsk: 1.4,
  Dublin: 1.4,
  Ahvaz: 1.4,
  Dhanbad: 1.4,
  Nottingham: 1.4,
  Putian: 1.4,
  Yichang: 1.4,
  Edmonton: 1.4,
  Kotā: 1.4,
  Rosario: 1.4,
  Torreón: 1.4,
  Buffalo: 1.4,
  Chonburi: 1.4,
  PortElizabeth: 1.4,
  Tbilisi: 1.4,
  Adelaide: 1.3,
  Tananarive: 1.3,
  Harrisburg: 1.3,
  Qinhuangdao: 1.3,
  Zhuzhou: 1.3,
  Managua: 1.3,
  Bareilly: 1.3,
  Hamamatsu: 1.3,
  Tainan: 1.3,
  Zhanjiang: 1.3,
  Antalya: 1.3,
  Barquisimeto: 1.3,
  Helsinki: 1.3,
  Konya: 1.3,
  McAllen: 1.3,
  Niamey: 1.3,
  Rostov_on_Don: 1.3,
  Samara: 1.3,
  Sofia: 1.3,
  Lille: 1.3,
  Qom: 1.3,
  Sevilla: 1.3,
  Fes: 1.3,
  Nouakchott: 1.3,
  Bucaramanga: 1.3,
  Kazan: 1.3,
  Morādābād: 1.3,
  Nanyang: 1.3,
  Stockton: 1.3,
  Benguela: 1.3,
  Ottawa: 1.3,
  Tripoli: 1.3,
  Zunyi: 1.3,
  Alīgarh: 1.2,
  Jining: 1.2,
  Kananga: 1.2,
  Mianyang: 1.2,
  Mysore: 1.2,
  Rizhao: 1.2,
  SanLuisPotosí: 1.2,
  Antwerp: 1.2,
  Mombasa: 1.2,
  Nanchong: 1.2,
  Pekanbaru: 1.2,
  Fuyang: 1.2,
  Jingzhou: 1.2,
  Maiduguri: 1.2,
  Naha: 1.2,
  SanPedroSula: 1.2,
  Tiruchirappalli: 1.2,
  BandarLampung: 1.2,
  Baoji: 1.2,
  Karawang: 1.2,
  MelbourneUS: 1.2,
  Nuremberg: 1.2,
  Onitsha: 1.2,
  Weihai: 1.2,
  Agadir: 1.2,
  Bangui: 1.2,
  Oslo: 1.2,
  Kigali: 1.2,
  Luzhou: 1.2,
  Ma_anshan: 1.2,
  Pointe_Noire: 1.2,
  Aguascalientes: 1.2,
  Changde: 1.2,
  Kisangani: 1.2,
  Memphis: 1.2,
  Southampton: 1.2,
  Aba: 1.2,
  Hanover: 1.2,
  Kumamoto: 1.2,
  Lianyungang: 1.2,
  Mérida: 1.2,
  Serang: 1.2,
  Tegucigalpa: 1.2,
  Yueyang: 1.2,
  Zhenjiang: 1.2,
  Gauhati: 1.1,
  Hubli_Dharwar: 1.1,
  OklahomaCity: 1.1,
  Quetta: 1.1,
  Shizuoka: 1.1,
  Sousse: 1.1,
  Wanzhou: 1.1,
  Cartagena: 1.1,
  Ulanhad: 1.1,
  Greensboro: 1.1,
  JoãoPessoa: 1.1,
  Krasnoyarsk: 1.1,
  Suzhou: 1.1,
  Ufa: 1.1,
  Cirebon: 1.1,
  Jullundur: 1.1,
  Kaifeng: 1.1,
  Marrakesh: 1.1,
  Nur_Sultan: 1.1,
  Omsk: 1.1,
  Cangnan: 1.1,
  Maceió: 1.1,
  Odessa: 1.1,
  Perm: 1.1,
  Salem: 1.1,
  Tangier: 1.1,
  Ulsan: 1.1,
  Benxi: 1.1,
  Jinzhou: 1.1,
  Khulna: 1.1,
  Erbil: 1.1,
  Bishkek: 1.1,
  CapeCoral: 1.1,
  Kayseri: 1.1,
  Mendoza: 1.1,
  Saratov: 1.1,
  Sholapur: 1.1,
  Arequipa: 1.1,
  Bordeaux: 1.1,
  Touba: 1.1,
  Ilorin: 1.1,
  Qingyuan: 1.1,
  Richmond: 1.1,
  Lilongwe: 1.1,
  Louisville: 1.1,
  Mexicali: 1.1,
  Tengzhou: 1.1,
  Voronezh: 1.1,
  Zaozhuang: 1.1,
  Changshu: 1.1,
  Cuernavaca: 1.1,
  Qiqihar: 1.1,
  Shymkent: 1.1,
  Suqian: 1.1,
  Changwon: 1.0,
  Changzhi: 1.0,
  Diyarbakır: 1.0,
  Pingxiang: 1.0,
  Teresina: 1.0,
  Toulouse: 1.0,
  ElPaso: 1.0,
  Kirkuk: 1.0,
  Málaga: 1.0,
  Panjin: 1.0,
  Yibin: 1.0,
  Zigong: 1.0,
  Jos: 1.0,
  Kermānshāh: 1.0,
  Calicut: 1.0,
  Pingdingshan: 1.0,
  SanMigueldeTucumán: 1.0,
  Shiliguri: 1.0,
  Valparaíso: 1.0,
  DaNang: 1.0,
  Dushanbe: 1.0,
  Florence: 1.0,
  NewOrleans: 1.0,
  Yingkou: 1.0,
  Banjul: 1.0,
  Bremen: 1.0,
  Enugu: 1.0,
  Florianópolis: 1.0,
  Hechuan: 1.0,
  Honolulu: 1.0,
  Jiaxing: 1.0,
  Mersin: 1.0,
  Morelia: 1.0,
  Tucson: 1.0,
  Warri: 1.0,
  Zaria: 1.0
}; // https://en.wikipedia.org/wiki/List_of_causes_of_death_by_rate
// data by deaths per 100,000

const MortalityRates = {
  'Cardiovascular': 268.8,
  'InfectiousAndParasitic': 211.3,
  'CoronaryArtery': 115.8,
  'MalignantNeoplasms': 114.4,
  'Cerebrovascular': 88.5,
  'RespiratoryInfections': 63.7,
  'LowerRespiratoryTractInfections': 62.4,
  'Respiratory': 59.5,
  'UnintentionalInjuries': 57.0,
  'HIV': 44.6,
  'ChronicObstructivePulmonary': 44.1,
  'PerinatalConditions': 39.6,
  'Digestive': 31.6,
  'Diarrhea': 28.9,
  'IntentionalInjuries': 26.0,
  'Tuberculosis': 25.2,
  'Malaria': 20.4,
  'LungCancer': 20.0
};
const PowerCars = {
  Evija: 1471,
  Speedtail: 772,
  Valhalla: 746,
  SF90Stradale: 735,
  SiánFKP37: 603,
  Jesko: 1177,
  Valkyrie: 865,
  Battista: 1408,
  'TSR-S': 878,
  One: 813,
  ChallengerDemon: 626,
  Chiron: 1103,
  Regera: 1103,
  AgeraRS: 1000,
  LaFerrari: 708,
  P1: 673,
  '918Spyder': 652,
  VeyronSuperSport: 883,
  UltimateAeroTT: 960,
  ST1: 812,
  CCR: 601
}; // https://en.wikipedia.org/wiki/List_of_recessions_in_the_United_States

const Recessions = {
  1929: -26.7,
  1937: -18.2,
  1945: -12.7,
  1949: -1.7,
  1953: -2.6,
  1958: -3.7,
  1960: -1.6,
  1969: -0.6,
  1973: -3.2,
  1980: -2.2,
  1981: -2.7,
  1990: -1.4,
  2001: -0.3,
  2008: -5.1
};

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class Foba extends Flopper {}

_defineProperty$1(Foba, "ArmSales", ArmSales);

_defineProperty$1(Foba, "BrentPrices", BrentPrices);

_defineProperty$1(Foba, "CityPopulations", CityPopulations);

_defineProperty$1(Foba, "MortalityRates", MortalityRates);

_defineProperty$1(Foba, "PowerCars", PowerCars);

_defineProperty$1(Foba, "Recessions", Recessions);

const CarPlants = {
  SantAgata: 'Lamborghini',
  Angelholm: 'Koenigsegg',
  Molsheim: 'Bugatti',
  Gaydon: 'Aston Martin',
  Maranello: 'Ferrari',
  Stuttgart: 'Porsche',
  Modena: 'Pagani',
  Neckarsulm: 'Audi',
  Crewe: 'Bentley',
  Woking: 'McLaren',
  Hethel: 'Lotus'
};
const FilmActors = {
  'Reversal of Fortune': 'Jeremy Irons',
  'Dances with Wolves': 'Kevin Costner',
  'Awakenings': 'Robert De Niro',
  'Cyrano de Bergerac': 'Gérard Depardieu',
  'The Field': 'Richard Harris',
  'The Silence of the Lambs': 'Anthony Hopkins',
  'Bugsy': 'Warren Beatty',
  'Cape Fear': 'Robert De Niro',
  'The Prince of Tides': 'Nick Nolte',
  'The Fisher King': 'Robin Williams',
  'Scent of a Woman': 'Al Pacino',
  'Chaplin': 'Robert Downey, Jr.',
  'Unforgiven': 'Clint Eastwood',
  'The Crying Game': 'Stephen Rea',
  'Malcolm X': 'Denzel Washington',
  'Philadelphia': 'Tom Hanks',
  'In the Name of the Father': 'Daniel Day-Lewis',
  'What\'s Love Got to Do with It': 'Laurence Fishburne',
  'The Remains of the Day': 'Anthony Hopkins',
  'Schindler\'s List': 'Liam Neeson',
  'Forrest Gump': 'Tom Hanks',
  'The Shawshank Redemption': 'Morgan Freeman',
  'The Madness of King George': 'Nigel Hawthorne',
  'Nobody\'s Fool': 'Paul Newman',
  'Pulp Fiction': 'John Travolta',
  'Leaving Las Vegas': 'Nicolas Cage',
  'Mr. Holland\'s Opus': 'Richard Dreyfuss',
  'Nixon': 'Anthony Hopkins',
  'Dead Man Walking': 'Sean Penn',
  'Il Postino': 'Massimo Troisi',
  'Shine': 'Geoffrey Rush',
  'Jerry Maguire': 'Tom Cruise',
  'The English Patient': 'Ralph Fiennes',
  'The People vs. Larry Flynt': 'Woody Harrelson',
  'Sling Blade': 'Billy Bob Thornton',
  'As Good as It Gets': 'Jack Nicholson',
  'Good Will Hunting': 'Matt Damon',
  'The Apostle': 'Robert Duvall',
  'Ulee\'s Gold': 'Peter Fonda',
  'Wag the Dog': 'Dustin Hoffman',
  'Life Is Beautiful': 'Roberto Benigni',
  'Saving Private Ryan': 'Tom Hanks',
  'Gods and Monsters': 'Ian McKellen',
  'Affliction': 'Nick Nolte',
  'American History X': 'Edward Norton',
  'American Beauty': 'Kevin Spacey',
  'The Insider': 'Russell Crowe',
  'The Straight Story': 'Richard Farnsworth',
  'Sweet and Lowdown': 'Sean Penn',
  'The Hurricane': 'Denzel Washington',
  'Gladiator': 'Russell Crowe',
  'Before Night Falls': 'Javier Bardem',
  'Cast Away': 'Tom Hanks',
  'Pollock': 'Ed Harris',
  'Quills': 'Geoffrey Rush',
  'Training Day': 'Denzel Washington',
  'A Beautiful Mind': 'Russell Crowe',
  'I Am Sam': 'Sean Penn',
  'Ali': 'Will Smith',
  'In the Bedroom': 'Tom Wilkinson',
  'The Pianist': 'Adrien Brody',
  'Adaptation.': 'Nicolas Cage',
  'The Quiet American': 'Michael Caine',
  'Gangs of New York': 'Daniel Day-Lewis',
  'About Schmidt': 'Jack Nicholson',
  'Mystic River': 'Sean Penn',
  'Pirates of the Caribbean: The Curse of the Black Pearl': 'Johnny Depp',
  'House of Sand and Fog': 'Ben Kingsley',
  'Cold Mountain': 'Jude Law',
  'Lost in Translation': 'Bill Murray',
  'Ray': 'Jamie Foxx',
  'Hotel Rwanda': 'Don Cheadle',
  'Finding Neverland': 'Johnny Depp',
  'The Aviator': 'Leonardo DiCaprio',
  'Million Dollar Baby': 'Clint Eastwood',
  'Capote': 'Philip Seymour Hoffman',
  'Hustle & Flow': 'Terrence Howard',
  'Brokeback Mountain': 'Heath Ledger',
  'Walk the Line': 'Joaquin Phoenix',
  'Good Night, and Good Luck': 'David Strathairn',
  'The Last King of Scotland': 'Forest Whitaker',
  'Blood Diamond': 'Leonardo DiCaprio',
  'Half Nelson': 'Ryan Gosling',
  'Venus': 'Peter O\'Toole',
  'The Pursuit of Happyness': 'Will Smith',
  'There Will Be Blood': 'Daniel Day-Lewis',
  'Michael Clayton': 'George Clooney',
  'Sweeney Todd: The Demon Barber of Fleet Street': 'Johnny Depp',
  'In the Valley of Elah': 'Tommy Lee Jones',
  'Eastern Promises': 'Viggo Mortensen',
  'Milk': 'Sean Penn',
  'The Visitor': 'Richard Jenkins',
  'Frost/Nixon': 'Frank Langella',
  'The Curious Case of Benjamin Button': 'Brad Pitt',
  'The Wrestler': 'Mickey Rourke',
  'Crazy Heart': 'Jeff Bridges',
  'Up in the Air': 'George Clooney',
  'A Single Man': 'Colin Firth',
  'Invictus': 'Morgan Freeman',
  'The Hurt Locker': 'Jeremy Renner'
};
const FilmActresses = {
  'Misery': 'Kathy Bates',
  'The Grifters': 'Anjelica Huston',
  'Pretty Woman': 'Julia Roberts',
  'Postcards from the Edge': 'Meryl Streep',
  'Mr. and Mrs. Bridge': 'Joanne Woodward',
  'The Silence of the Lambs': 'Jodie Foster',
  'Thelma & Louise': 'Geena Davis',
  'Rambling Rose': 'Laura Dern',
  'For the Boys': 'Bette Midler',
  'Thelma & Louise_': 'Susan Sarandon',
  'Howards End': 'Emma Thompson',
  'Indochine': 'Catherine Deneuve',
  'Passion Fish': 'Mary McDonnell',
  'Love Field': 'Michelle Pfeiffer',
  'Lorenzo\'s Oil': 'Susan Sarandon',
  'The Piano': 'Holly Hunter',
  'What\'s Love Got to Do with It': 'Angela Bassett',
  'Six Degrees of Separation': 'Stockard Channing',
  'The Remains of the Day': 'Emma Thompson',
  'Shadowlands': 'Debra Winger',
  'Blue Sky': 'Jessica Lange',
  'Nell': 'Jodie Foster',
  'Tom & Viv': 'Miranda Richardson',
  'Little Women': 'Winona Ryder',
  'The Client': 'Susan Sarandon',
  'Dead Man Walking': 'Susan Sarandon',
  'Leaving Las Vegas': 'Elisabeth Shue',
  'Casino': 'Sharon Stone',
  'The Bridges of Madison County': 'Meryl Streep',
  'Sense and Sensibility': 'Emma Thompson',
  'Fargo': 'Frances McDormand',
  'Secrets & Lies': 'Brenda Blethyn',
  'Marvin\'s Room': 'Diane Keaton',
  'The English Patient': 'Kristin Scott Thomas',
  'Breaking the Waves': 'Emily Watson',
  'As Good as It Gets': 'Helen Hunt',
  'The Wings of the Dove': 'Helena Bonham Carter',
  'Afterglow': 'Julie Christie',
  'Mrs. Brown': 'Judi Dench',
  'Titanic': 'Kate Winslet',
  'Shakespeare in Love': 'Gwyneth Paltrow',
  'Elizabeth': 'Cate Blanchett',
  'Central Station': 'Fernanda Montenegro',
  'One True Thing': 'Meryl Streep',
  'Hilary and Jackie': 'Emily Watson',
  'Boys Don\'t Cry': 'Hilary Swank',
  'American Beauty': 'Annette Bening',
  'Tumbleweeds': 'Janet McTeer',
  'The End of the Affair': 'Julianne Moore',
  'Music of the Heart': 'Meryl Streep',
  'Erin Brockovich': 'Julia Roberts',
  'The Contender': 'Joan Allen',
  'Chocolat': 'Juliette Binoche',
  'Requiem for a Dream': 'Ellen Burstyn',
  'You Can Count on Me': 'Laura Linney',
  'Monster\'s Ball': 'Halle Berry',
  'Iris': 'Judi Dench',
  'Moulin Rouge!': 'Nicole Kidman',
  'In the Bedroom': 'Sissy Spacek',
  'Bridget Jones\'s Diary': 'Renée Zellweger',
  'The Hours': 'Nicole Kidman',
  'Frida': 'Salma Hayek',
  'Unfaithful': 'Diane Lane',
  'Far from Heaven': 'Julianne Moore',
  'Chicago': 'Renée Zellweger',
  'Monster': 'Charlize Theron',
  'Whale Rider': 'Keisha Castle-Hughes',
  'Something\'s Gotta Give': 'Diane Keaton',
  'In America': 'Samantha Morton',
  '21 Grams': 'Naomi Watts',
  'Million Dollar Baby': 'Hilary Swank',
  'Being Julia': 'Annette Bening',
  'Maria Full of Grace': 'Catalina Sandino Moreno',
  'Vera Drake': 'Imelda Staunton',
  'Eternal Sunshine of the Spotless Mind': 'Kate Winslet',
  'Walk the Line': 'Reese Witherspoon',
  'Mrs Henderson Presents': 'Judi Dench',
  'Transamerica': 'Felicity Huffman',
  'Pride & Prejudice': 'Keira Knightley',
  'North Country': 'Charlize Theron',
  'The Queen': 'Helen Mirren',
  'Volver': 'Penélope Cruz',
  'Notes on a Scandal': 'Judi Dench',
  'The Devil Wears Prada': 'Meryl Streep',
  'Little Children': 'Kate Winslet',
  'La Vie en Rose': 'Marion Cotillard',
  'Elizabeth: The Golden Age': 'Cate Blanchett',
  'Away from Her': 'Julie Christie',
  'The Savages': 'Laura Linney',
  'Juno': 'Ellen Page',
  'The Reader': 'Kate Winslet',
  'Rachel Getting Married': 'Anne Hathaway',
  'Changeling': 'Angelina Jolie',
  'Frozen River': 'Melissa Leo',
  'Doubt': 'Meryl Streep',
  'The Blind Side': 'Sandra Bullock',
  'The Last Station': 'Helen Mirren',
  'An Education': 'Carey Mulligan',
  'Precious': 'Gabourey Sidibe',
  'Julie & Julia': 'Meryl Streep'
};
const FilmDirectors = {
  'Dances with Wolves': 'Kevin Costner',
  'The Godfather Part III': 'Francis Ford Coppola',
  'The Grifters': 'Stephen Frears',
  'Reversal of Fortune': 'Barbet Schroeder',
  'Goodfellas': 'Martin Scorsese',
  'The Silence of the Lambs': 'Jonathan Demme',
  'Bugsy': 'Barry Levinson',
  'Thelma & Louise': 'Ridley Scott',
  'Boyz n the Hood': 'John Singleton',
  'JFK': 'Oliver Stone',
  'Unforgiven': 'Clint Eastwood',
  'The Player': 'Robert Altman',
  'Scent of a Woman': 'Martin Brest',
  'Howards End': 'James Ivory',
  'The Crying Game': 'Neil Jordan',
  'Schindler\'s List': 'Steven Spielberg',
  'Short Cuts': 'Robert Altman',
  'The Piano': 'Jane Campion',
  'The Remains of the Day': 'James Ivory',
  'In the Name of the Father': 'Jim Sheridan',
  'Forrest Gump': 'Robert Zemeckis',
  'Bullets Over Broadway': 'Woody Allen',
  'Three Colors: Red': 'Krzysztof Kieślowski',
  'Quiz Show': 'Robert Redford',
  'Pulp Fiction': 'Quentin Tarantino',
  'Braveheart': 'Mel Gibson',
  'Leaving Las Vegas': 'Mike Figgis',
  'Babe': 'Chris Noonan',
  'Il Postino': 'Michael Radford',
  'Dead Man Walking': 'Tim Robbins',
  'The English Patient': 'Anthony Minghella',
  'Fargo': 'Joel Coen',
  'The People vs. Larry Flynt': 'Miloš Forman',
  'Shine': 'Scott Hicks',
  'Secrets & Lies': 'Mike Leigh',
  'Titanic': 'James Cameron',
  'The Full Monty': 'Peter Cattaneo',
  'The Sweet Hereafter': 'Atom Egoyan',
  'L.A. Confidential': 'Curtis Hanson',
  'Good Will Hunting': 'Gus Van Sant',
  'Saving Private Ryan': 'Steven Spielberg',
  'Life Is Beautiful': 'Roberto Benigni',
  'Shakespeare in Love': 'John Madden',
  'The Thin Red Line': 'Terrence Malick',
  'The Truman Show': 'Peter Weir',
  'American Beauty': 'Sam Mendes',
  'The Cider House Rules': 'Lasse Hallström',
  'Being John Malkovich': 'Spike Jonze',
  'The Insider': 'Michael Mann',
  'The Sixth Sense': 'M. Night Shyamalan',
  'Traffic': 'Steven Soderbergh',
  'Billy Elliot': 'Stephen Daldry',
  'Crouching Tiger, Hidden Dragon': 'Ang Lee',
  'Gladiator': 'Ridley Scott',
  'Erin Brockovich': 'Steven Soderbergh',
  'A Beautiful Mind': 'Ron Howard',
  'Gosford Park': 'Robert Altman',
  'The Lord of the Rings: The Fellowship of the Ring': 'Peter Jackson',
  'Mulholland Drive': 'David Lynch',
  'The Pianist': 'Roman Polanski',
  'Black Hawk Down': 'Ridley Scott',
  'Talk to Her': 'Pedro Almodóvar',
  'The Hours': 'Stephen Daldry',
  'Chicago': 'Rob Marshall',
  'The Lord of the Rings: The Return of the King': 'Peter Jackson',
  'Gangs of New York': 'Martin Scorsese',
  'Lost in Translation': 'Sofia Coppola',
  'Mystic River': 'Clint Eastwood',
  'City of God': 'Fernando Meirelles',
  'Master and Commander: The Far Side of the World': 'Peter Weir',
  'Million Dollar Baby': 'Clint Eastwood',
  'Ray': 'Taylor Hackford',
  'Vera Drake': 'Mike Leigh',
  'Sideways': 'Alexander Payne',
  'The Aviator': 'Martin Scorsese',
  'Brokeback Mountain': 'Ang Lee',
  'Good Night, and Good Luck.': 'George Clooney',
  'Crash': 'Paul Haggis',
  'Capote': 'Bennett Miller',
  'Munich': 'Steven Spielberg',
  'The Departed': 'Martin Scorsese',
  'Letters from Iwo Jima': 'Clint Eastwood',
  'The Queen': 'Stephen Frears',
  'Babel': 'Alejandro González Iñárritu',
  'United 93': 'Paul Greengrass',
  'No Country for Old Men': 'Joel & Ethan Coen',
  'There Will Be Blood': 'Paul Thomas Anderson',
  'Michael Clayton': 'Tony Gilroy',
  'Juno': 'Jason Reitman',
  'The Diving Bell and the Butterfly': 'Julian Schnabel',
  'Slumdog Millionaire': 'Danny Boyle',
  'The Reader': 'Stephen Daldry',
  'The Curious Case of Benjamin Button': 'David Fincher',
  'Frost/Nixon': 'Ron Howard',
  'Milk': 'Gus Van Sant',
  'Avatar': 'James Cameron',
  'The Hurt Locker': 'Kathryn Bigelow',
  'Precious: Based on the Novel "Push" by Sapphire': 'Lee Daniels',
  'Up in the Air': 'Jason Reitman',
  'Inglourious Basterds': 'Quentin Tarantino'
};
const MilitaryRobots = {
  MechanicalHound: 'Fahrenheit 451',
  AMEE: 'Red Planet',
  SIMON: 'Lara Croft Tomb Raider',
  ED209: 'RoboCop',
  BattleRobotT1: 'Terminator 3 Rise of the Machines',
  Johnny5: 'Short Circuit',
  MARK: 'Hardware',
  EDI: 'Stealth',
  VTOLCraftT1: 'Terminator 3 Rise of the Machines',
  CyberdyneT800: 'Terminator series',
  EosB1: 'Star Wars Ep. I/II/III',
  EosB2: 'Star Wars Ep. II/III',
  HolowanMagnaGuards: 'Star Wars Ep. III',
  Decepticons: 'Transformers',
  HectorModel: 'Saturn 3',
  STAR: 'The Black Hole',
  CylonCenturion: 'Battlestar Galactica',
  Protectron: 'Fallout',
  SentryBot: 'Fallout',
  LibertyPrime: 'Fallout',
  CyberdyneT1000: 'Terminator 2 Judgment Day',
  Terminatrix: 'Terminator 3 Rise of the Machines',
  Synth: 'Fallout',
  Sentinels: 'The Matrix series',
  RobotB9: 'Lost in Space',
  Droideka: 'Star Wars Ep. I,II,III',
  R2D2: 'Star Wars series',
  VINCENT: 'The Black Hole',
  BOB: 'The Black Hole',
  Maximilian: 'The Black Hole',
  MisterGusty: 'Fallout series',
  SuperSentinels: 'Halo 1/2/3',
  Screamers: 'Screamers',
  APU: 'The Matrix Revolutions',
  IronManSuit: 'Iron Man',
  AMP: 'Avatar',
  MANTIS: 'M.A.N.T.I.S.',
  PoweredInfantryArmorT51: 'Fallout series'
};
const Pastas = {
  conchiglie: 'seashell shaped, usually furrowed (rigate)',
  chifferi: 'short and wide macaroni',
  farfalle: 'bow tie or butterfly shaped',
  fusilli: 'long, thick, corkscrew-shaped pasta that may be solid or hollow',
  gnocchi: 'lobed shells. Not to be confused with gnocchi dumplings',
  lasagna: 'square or rectangle sheets of pasta',
  linguine: 'flattened spaghetti',
  pennine: 'medium length tubes with ridges, cut diagonally at both ends',
  ravioli: 'wwo squares of pasta on top of another, stuffed with fill',
  spaghetti: 'long, thin, cylindrical pasta of Italian origin'
};

function _defineProperty$2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class Foba$1 extends Flopper {}

_defineProperty$2(Foba$1, "CarPlants", CarPlants);

_defineProperty$2(Foba$1, "FilmActors", FilmActors);

_defineProperty$2(Foba$1, "FilmActresses", FilmActresses);

_defineProperty$2(Foba$1, "FilmDirectors", FilmDirectors);

_defineProperty$2(Foba$1, "MilitaryRobots", MilitaryRobots);

_defineProperty$2(Foba$1, "Pastas", Pastas);

class Foba$2 extends Flopper {
  static get carPlants() {
    return Object.keys(CarPlants);
  }

  static get actorBriefs() {
    var _Object$values;

    return _Object$values = Object.values(FilmActors), namesToBrief(_Object$values);
  }

  static get actressBriefs() {
    var _Object$values2;

    return _Object$values2 = Object.values(FilmActresses), namesToBrief(_Object$values2);
  }

  static get directorBriefs() {
    var _Object$values3;

    return _Object$values3 = Object.values(FilmDirectors), namesToBrief(_Object$values3);
  }

  static get pastas() {
    return Object.keys(Pastas);
  }

  static get armDealers() {
    return Object.keys(ArmSales);
  }

  static get megaCities() {
    return Object.keys(CityPopulations);
  }

  static get deathCauses() {
    return Object.keys(MortalityRates);
  }

  static get powerCars() {
    return Object.keys(PowerCars);
  }

  static get recessionYears() {
    return Object.keys(Recessions);
  }

}

_defineProperty(Foba$2, "actors", actors);

_defineProperty(Foba$2, "actresses", actresses);

_defineProperty(Foba$2, "directors", directors);

const {
  random: random$1,
  abs: abs$1,
  exp: exp$1,
  log: log$1,
  sqrt: sqrt$1,
  pow: pow$1,
  cos: cos$1,
  sin: sin$1,
  PI: PI$1
} = Math;

const randIdx$1 = arr => ~~(random$1() * arr.length);

const randSel$1 = arr => arr[randIdx$1(arr)];

const R0$1 = 3.442619855899;
const R1$1 = 1.0 / R0$1;
const R0S$1 = exp$1(-0.5 * R0$1 * R0$1);
const N2P32$1 = -pow$1(2, 32);
const M1$1 = 2147483648.0;
const VN$1 = 9.91256303526217e-3;

class Ziggurat$1 {
  constructor(mean = 0, stdev = 1) {
    this.jsr = 123456789;
    this.wn = Array(128);
    this.fn = Array(128);
    this.kn = Array(128);
    this.mean = mean;
    this.stdev = stdev;
    this.preset();
  }

  preset() {
    // seed generator based on current time
    this.jsr ^= new Date().getTime();
    let m1 = M1$1,
        dn = R0$1,
        tn = R0$1,
        vn = VN$1,
        q = vn / R0S$1;
    this.kn[0] = ~~(dn / q * m1);
    this.kn[1] = 0;
    this.wn[0] = q / m1;
    this.wn[127] = dn / m1;
    this.fn[0] = 1.0;
    this.fn[127] = R0S$1;

    for (let i = 126; i >= 1; i--) {
      dn = sqrt$1(-2.0 * log$1(vn / dn + exp$1(-0.5 * dn * dn)));
      this.kn[i + 1] = ~~(dn / tn * m1);
      tn = dn;
      this.fn[i] = exp$1(-0.5 * dn * dn);
      this.wn[i] = dn / m1;
    }
  }

  next() {
    return this.randSample() * this.stdev + this.mean;
  }

  nextInt() {
    return Math.round(this.next());
  }

  randSample() {
    let hz = this.xorshift(),
        iz = hz & 127;
    return abs$1(hz) < this.kn[iz] ? hz * this.wn[iz] : this.nfix(hz, iz);
  }

  nfix(hz, iz) {
    let r = R0$1,
        x,
        y;

    while (true) {
      x = hz * this.wn[iz];

      if (iz === 0) {
        do {
          x = -log$1(this.uni()) * R1$1;
          y = -log$1(this.uni());
        } while (y + y < x * x); // {
        //   x = -log(this.uni()) * r1
        //   y = -log(this.uni())
        // }


        return hz > 0 ? r + x : -r - x;
      }

      if (this.fn[iz] + this.uni() * (this.fn[iz - 1] - this.fn[iz]) < exp$1(-0.5 * x * x)) return x;
      hz = this.xorshift();
      iz = hz & 127;
      if (abs$1(hz) < this.kn[iz]) return hz * this.wn[iz];
    }
  }

  xorshift() {
    let m = this.jsr,
        n = m;
    n ^= n << 13;
    n ^= n >>> 17;
    n ^= n << 5;
    this.jsr = n;
    return m + n | 0;
  }

  uni() {
    return 0.5 + this.xorshift() / N2P32$1;
  }

}

class Roulett$1 {
  /**
   * From [min, max] return a random integer.
   * Of [min, max], both min and max are inclusive.
   * @param {number} min(inclusive) - int
   * @param {number} max(inclusive) - int
   * @returns {number} int
   */
  static between(min, max) {
    return ~~(random$1() * (max - min + 1)) + min;
  }
  /**
   * From [min, max) return a random integer.
   * Of [min, max), min is inclusive but max is exclusive.
   * @param {number} min(inclusive) - int
   * @param {number} max(exclusive) - int
   * @returns {number} int
   */


  static rand(min, max) {
    return ~~(random$1() * (max - min)) + min;
  }

  static index(len) {
    return ~~(random$1() * len);
  }

  static arrayIndex(arr) {
    return randIdx$1(arr);
  }

  static element(arr) {
    return randSel$1(arr);
  }

  static key(obj) {
    return randSel$1(Object.keys(obj));
  }

  static value(obj) {
    return randSel$1(Object.values(obj));
  }

  static entry(obj) {
    return randSel$1(Object.entries(obj));
  }
  /**
   * Return an array of random number that follows gaussian distribution(normal distribution).
   * @param {number} len - length of the returned array
   * @param {number} mean - mean
   * @param {number} stdev - standard deviation
   * @returns {number[]}
   */


  static gaussSamples(len, mean = 0, stdev = 1) {
    const z = new Ziggurat$1(mean, stdev),
          arr = Array(len);

    for (let i = 0; i < len; i++) arr[i] = z.next();

    return arr;
  }

}

const round = x => x + (x > 0 ? 0.5 : -0.5) << 0;

function trimDigit(n) {
  return round(n * this.m) / this.m;
}
/**
 *
 * @param {number} d - digits
 * @returns {function(number):number}
 * @constructor
 */


const TrimDigit = d => trimDigit.bind({
  m: 10 ** d
});

const td2 = TrimDigit(2);
const td4 = TrimDigit(4);
/**
 *
 * @param {number} l length
 * @param {function(number?):*} fn function
 * @param {number} [d]
 * @returns {*[]}
 */

const seq = (l, fn, d) => {
  if (d) return seqTd(l, fn, d);
  const ar = Array(l);

  for (let i = 0; i < l; i++) ar[i] = fn(i);

  return ar;
};

const seqTd = (l, fn, d = 2) => {
  const ar = Array(l);

  for (let i = 0, td = TrimDigit(d); i < l; i++) ar[i] = td(fn(i));

  return ar;
};

const balanceByCompInterest = (l, r = 0.1, d = 3) => {
  r++;
  let n = 1,
      td = TrimDigit(d);
  return seq(l, () => td(n *= r), d);
};

function* fiboGen() {
  let [prev, curr] = [0, 1];

  for (;;) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

const fibonacci = l => {
  const gen = fiboGen();
  const ar = Array(l);

  for (let i = 0; i < l; i++) ar[i] = gen.next().value;

  return ar;
};

const GOV_EXPENDITURE = 100,
      CONSUMPTION = 50,
      INVESTMENT = 100,
      MP_CONSUME = 0.28,
      INV_MULTIPLIER = 5;

function* hansenSamuelsonGenerator({
  g,
  c,
  i,
  a,
  b
}, d) {
  /** @type {number} gdp */
  let y = 0;
  /** @type {number} consumption of last term*/

  let k = 0;
  /** @type {function} */

  const td = TrimDigit(d);

  while (true) {
    y = g + c + i;
    yield {
      c: td(c),
      i: td(i),
      y: td(y)
    };
    k = c;
    c = a * y;
    i = b * (c - k);
  }
}
/**
 * A simulation to Hansen-Samuelson (Multiplier-Accelerator Model)
 * @param {number} l length of simulation array
 * @param {number} g government spending - constant each term
 * @param {number} c consumption - c=a*y
 * @param {number} i investment - i=b*(c[t]-c[t-1])
 * @param {number} a marginal propensity to consume
 * @param {number} b investment multiplier
 * @param {number} d trailing digits to keep
 * @returns {{c:number,i:number,y:number}[]}
 */


const hansenSamuelson = (l, {
  g = GOV_EXPENDITURE,
  c = CONSUMPTION,
  i = INVESTMENT,
  a = MP_CONSUME,
  b = INV_MULTIPLIER
} = {}, d = 2) => {
  const hsg = hansenSamuelsonGenerator({
    g,
    c,
    i,
    a,
    b
  }, d);
  return seq(l, () => hsg.next().value);
};

const sqrt$1$1 = Math.sqrt;

const nonSquares = l => {
  const HALF = 1 / 2;

  let nonSquare = n => n + ~~(HALF + sqrt$1$1(n));

  return seq(l, i => nonSquare(++i));
};

function isPrime(n) {
  if (n < 2) return false;
  if (!(n % 2)) return n === 2;
  if (!(n % 3)) return n === 3;
  let d = 5;

  while (d * d <= n) {
    if (!(n % d)) return false;
    d += 2;
    if (!(n % d)) return false;
    d += 4;
  }

  return true;
}

const primes = l => {
  const ar = Array(l);

  for (let n = 2, i = 0;; n++) {
    if (isPrime(n)) ar[i++] = n;else if (i >= l) break;
  }

  return ar;
};

const range = l => seq(l, i => i);

const Specials = {
  PI: Math.PI,
  E: Math.E,
  SQR_2: Math.sqrt(2),
  SQR_3: Math.sqrt(3),
  SQR_5: Math.sqrt(5),
  GOLDEN: 1.61803398874989484820,
  MP10_3: 10 / 3,
  MP10_6: 10 / 6,
  GRAVITY: 6.67430,
  FEIGENBAUM: 4.669201609102990671853203821578,
  GAUSS_STDEV_1: 68.2689492137,
  GAUSS_STDEV_2: 95.4499736104,
  GAUSS_STDEV_3: 99.7300203937,
  LIGHT: 299792458,
  //m/s**2
  MOL: 6.02214076e+23,
  LOSCHMIDT: 2.6867811e+25,
  ABSOLUTE_ZERO: -273.15
};

const randF = () => 2 ** Roulett$1.rand(1, 12) - 1;

const absoluteMirror = (l = 5, d = 3) => {
  var _Object$values;

  if (l < 4) l = 4;
  let h = ~~(l / 2),
      r = l % 2;
  let positives = (_Object$values = Object.values(Specials), Shuffler({
    size: --h
  })(_Object$values));
  positives.push(randF());
  positives = positives.map(Math.abs).sort((a, b) => a - b);
  let negatives = positives.map(x => -x).reverse();
  if (r) negatives.push(0);
  const result = negatives.concat(positives);
  let td;
  return d ? (td = TrimDigit(d), result.map(td)) : result;
};

class Foba$3 {
  static range(l) {
    return range(l);
  }

  static primes(l) {
    return primes(l);
  }

  static fibonacci(l) {
    return fibonacci(l);
  }

  static nonSquares(l) {
    return nonSquares(l);
  }

  static absoluteMirror(l, d) {
    return absoluteMirror(l, d);
  }

  static balanceByCompInterest(l, r, d = 3) {
    if (!r) r = Roulett$1.rand(1, 30) / 100;
    return balanceByCompInterest(l, r, d);
  }

  static hansenSamuelson(l, {
    g,
    c,
    i,
    a,
    b
  } = {}, d) {
    if (!a) a = Roulett$1.rand(15, 50) / 100;
    if (!b) b = Roulett$1.rand(30, 80) / 10;
    let cb, ib;
    if (!c) cb = Roulett$1.rand(0, 3), c = cb * 50;
    if (!i) ib = Roulett$1.rand(1, 6), i = ib * 50;
    if (!g) g = ~~((cb + ib) / 3) * 50;
    return hansenSamuelson(l, {
      g,
      c,
      i,
      a,
      b
    }, d).map(({
      y
    }) => y);
  }

  static flop({
    p,
    size = 6,
    keyValuePair
  } = {}) {
    var _filter, _o;

    const o = Foba$3;
    p = p || (_filter = (_o = o, allFuncKeys(_o)).filter(x => !x.startsWith('flop')), Roulett$1.element(_filter));
    const shuffled = o[p].call(null, size);
    let ro;
    return keyValuePair ? (ro = {}, ro[p] = shuffled, ro) : shuffled;
  }

}

const {
  random: random$2
} = Math;

const rand = l => ~~(random$2() * l);

const flopIndex = ar => rand(ar.length);

const flop = ar => ar[flopIndex(ar)];

var _StrVecs$flop, _NumVecs$flop;
const Basics = {
  null: null,
  undefined: undefined,
  boolean: false,
  number: 1024,
  numNaN: NaN,
  numInf: Number.POSITIVE_INFINITY,
  string: (_StrVecs$flop = Foba$2.flop(), flop(_StrVecs$flop)),
  numStr: String((_NumVecs$flop = Foba$3.flop(), flop(_NumVecs$flop))),
  bigint: BigInt(9007199254740991)
};

const Numerics = {
  'num zero': 0,
  'num one': 1,
  'num frac': .42,
  'num positive': 1024,
  'num negative': -1024,
  'num EPSILON': Number.EPSILON,
  'num NaN': Number.NaN,
  'num POS_INF': Number.POSITIVE_INFINITY,
  'num NEG_INF': Number.NEGATIVE_INFINITY
};

// in millions USD

const ArmSales$1 = {
  LockheedMartin: 47260,
  Boeing: 29150,
  NorthropGrumman: 26190,
  Raytheon: 23440,
  GeneralDynamics: 22000,
  BAESystemsUK: 21210,
  AirbusGroup: 11650,
  BAESystemsUS: 10800,
  Leonardo: 9820,
  AlmazAntey: 9640,
  Thales: 9470,
  UnitedTechnologies: 9310,
  L3Technologies: 8250,
  HuntingtonIngallsInd: 7200,
  HoneywellIntr: 5430,
  UnitedAircraft: 5420,
  Leidos: 5000,
  Harris: 4970,
  UnitedShipbuilding: 4700,
  BoozAllenHamilton: 4680,
  RollsRoyce: 4680,
  NavalGroup: 4220,
  Rheinmetall: 3800,
  MBDA: 3780,
  GeneralElectric: 3650,
  MitsubishiHeavyInd: 3620,
  TacticalMissiles: 3600,
  Textron: 3500,
  ElbitSystems: 3500,
  CACIIntr: 3490,
  Saab: 3240,
  Safran: 3240,
  Sandia: 3200,
  BabcockIntr: 3180,
  UnitedEngine: 2950,
  DassaultAviation: 2930,
  ScienceApplicationsIntr: 2800,
  AECOM: 2770,
  GeneralAtomics: 2750,
  HindustanAeronautics: 2740,
  AirbusHelicoptersInc: 2730,
  IsraelAerospaceInd: 2650,
  HighPrecisionSystems: 2630,
  RockwellCollins: 2630,
  KBR: 2600,
  Perspecta: 2590,
  Rafael: 2540,
  RussianElectronics: 2330,
  HanwhaAerospace: 2320,
  CEA: 2300,
  KawasakiHeavyInd: 2260,
  BellHelicopterTextron: 2030,
  Bechtel: 2000,
  Fincantieri: 1900,
  Oshkosh: 1850,
  RussianHelicopters: 1810,
  KRET: 1770,
  ASELSAN: 1740,
  KraussMaffeiWegmann: 1680,
  IndianOrdnanceFactories: 1650,
  ThyssenKrupp: 1650,
  Cobham: 1590,
  DynCorpIntr: 1560,
  KoreaAerospaceInd: 1550,
  STEngineering: 1540,
  BharatElectronics: 1460,
  ManTechIntr: 1430,
  UralVagonZavod: 1370,
  JacobsEngineering: 1370,
  Fluor: 1350,
  LIGNex1: 1340,
  TransDigm: 1330,
  GKN: 1320,
  MelroseInd: 1320,
  UnitedLaunchAlliance: 1320,
  UkrOboronProm: 1300,
  Fujitsu: 1270,
  SercoGroup: 1260,
  PGZ: 1250,
  TeledyneTechnologies: 1240,
  Navantia: 1240,
  Hensoldt: 1240,
  Vectrus: 1230,
  AerojetRocketdyne: 1220,
  AustalUSA: 1160,
  Austal: 1140,
  SierraNevada: 1100,
  IHI: 1090,
  Nexter: 1080,
  TurkishAerospaceInd: 1070,
  BWXTechnologies: 1070,
  Engility: 1070,
  CAE: 1010,
  MIT: 980,
  Meggitt: 970,
  CurtissWright: 970,
  TheAerospace: 970,
  DevonportRoyalDockyard: 940,
  Ball: 930,
  Moog: 920,
  QinetiQ: 910,
  RUAG: 900,
  ViaSat: 860,
  MitsubishiElectric: 860,
  Arconic: 840,
  NEC: 840,
  Amphenol: 820
};
const BrentPrices$1 = {
  '2020': 61.25,
  '2019': 64.37,
  '2018': 71.34,
  '2017': 54.13,
  '2016': 43.64,
  '2015': 52.32,
  '2014': 98.97,
  '2013': 108.56,
  '2012': 111.63,
  '2011': 111.26,
  '2010': 79.61,
  '2009': 61.74,
  '2008': 96.94,
  '2007': 72.44,
  '2006': 65.16,
  '2005': 54.57,
  '2004': 38.26,
  '2003': 28.85,
  '2002': 24.99,
  '2001': 24.46,
  '2000': 28.66,
  '1999': 17.90,
  '1998': 12.76,
  '1997': 19.11,
  '1996': 20.64,
  '1995': 17.02,
  '1994': 15.86,
  '1993': 17.01,
  '1992': 19.32,
  '1991': 20.04,
  '1990': 23.76,
  '1989': 18.23,
  '1988': 14.91,
  '1987': 18.53
};
const CityPopulations$1 = {
  PearlRiverDelta: 46.7,
  Tokyo: 40.4,
  Shanghai: 33.6,
  Jakarta: 31.3,
  Delhi: 30.3,
  Manila: 25.7,
  Bombay: 25.1,
  Seoul: 24.8,
  MexicoCity: 23.0,
  SãoPaulo: 22.4,
  NewYork: 22.1,
  Cairo: 21.0,
  Dacca: 20.2,
  Beijing: 19.8,
  Lagos: 19.4,
  Bangkok: 18.8,
  Karachi: 17.8,
  LosAngeles: 17.7,
  Osaka: 17.7,
  Moscow: 17.3,
  Calcutta: 16.8,
  BuenosAires: 16.4,
  Istanbul: 16.0,
  Tehran: 15.3,
  London: 14.8,
  Johannesburg: 13.9,
  RiodeJaneiro: 13.2,
  Lahore: 13.0,
  Tientsin: 12.7,
  Kinshasa: 12.4,
  Bangalore: 12.2,
  Paris: 11.4,
  Madras: 11.3,
  Nagoya: 10.5,
  HyderabadIndia: 10.2,
  Lima: 10.1,
  Xiamen: 10.0,
  Chicago: 9.8,
  Bogotá: 9.6,
  Chengtu: 9.6,
  Taipei: 9.2,
  Wuhan: 9.1,
  KualaLumpur: 8.9,
  Saigon: 8.6,
  Washington: 8.6,
  Ahmedabad: 8.5,
  Hangchou: 8.5,
  Chungking: 8.2,
  Luanda: 8.2,
  Riyadh: 8.1,
  Shenyang: 8.0,
  Singapore: 7.9,
  SanFrancisco: 7.9,
  Boston: 7.8,
  Shantou: 7.7,
  HongKong: 7.5,
  Toronto: 7.5,
  Philadelphia: 7.4,
  Santiago: 7.3,
  Dallas: 7.2,
  Baghdad: 7.0,
  Bandung: 7.0,
  Sian: 7.0,
  Poona: 6.9,
  Houston: 6.8,
  Nanking: 6.6,
  Surat: 6.6,
  Madrid: 6.6,
  DaresSalaam: 6.5,
  Miami: 6.4,
  Khartoum: 6.3,
  Milan: 6.2,
  Tsingtao: 6.1,
  Surabaya: 6.1,
  Nairobi: 5.9,
  Atlanta: 5.9,
  Alexandria: 5.8,
  Detroit: 5.8,
  TheRuhr: 5.7,
  SaintPetersburg: 5.7,
  Abidjan: 5.6,
  Amman: 5.6,
  Rangoon: 5.6,
  Dubai: 5.4,
  Guadalajara: 5.4,
  Wenzhou: 5.4,
  Sydney: 5.3,
  Accra: 5.1,
  Harbin: 5.1,
  Ankara: 5.1,
  BeloHorizonte: 5.0,
  CologneDusseldorf: 5.0,
  Monterrey: 5.0,
  MelbourneAus: 5.0,
  Hofei: 5.0,
  Jeddah: 5.0,
  Zhengzhou: 5.0,
  Changsha: 4.9,
  Chittagong: 4.9,
  Barcelona: 4.8,
  KuwaitCity: 4.8,
  Colombo: 4.8,
  Berlin: 4.7,
  Kano: 4.7,
  Phoenix: 4.7,
  Shijiazhuang: 4.6,
  Dairen: 4.6,
  Casablanca: 4.5,
  Jinan: 4.5,
  Seattle: 4.4,
  Tampa: 4.4,
  Kabul: 4.3,
  Kunming: 4.3,
  CapeTown: 4.2,
  Montreal: 4.2,
  Naples: 4.2,
  Pusan: 4.1,
  PortoAlegre: 4.1,
  Taiyuan: 4.1,
  Ürümqi: 4.1,
  Fuzhou: 4.0,
  Medellín: 4.0,
  Brasília: 4.0,
  Medan: 4.0,
  SantoDomingo: 4.0,
  Algiers: 4.0,
  Jaipur: 4.0,
  Nanchang: 3.9,
  Recife: 3.9,
  Damascus: 3.8,
  AddisAbaba: 3.8,
  Hanoi: 3.8,
  Caracas: 3.8,
  Denver: 3.8,
  Dakar: 3.7,
  Lucknow: 3.7,
  Changchun: 3.7,
  Fortaleza: 3.7,
  Faisalabad: 3.7,
  Salvador: 3.6,
  Ibadan: 3.6,
  Rome: 3.6,
  Abuja: 3.5,
  Bamako: 3.5,
  Kampala: 3.5,
  Zibo: 3.5,
  Kanpur: 3.5,
  Kiev: 3.5,
  Nanning: 3.5,
  Orlando: 3.5,
  Rawalpindi: 3.5,
  Yaoundé: 3.5,
  Curitiba: 3.4,
  Durban: 3.4,
  Douala: 3.4,
  Athens: 3.4,
  SanDiego: 3.4,
  Guiyang: 3.3,
  Nagpur: 3.3,
  Ningbo: 3.3,
  FrankfurtamMain: 3.3,
  Rotterdam: 3.3,
  PortAuPrince: 3.2,
  Tashkent: 3.2,
  Campinas: 3.2,
  Isfahan: 3.2,
  Meshed: 3.2,
  Indore: 3.2,
  Minneapolis: 3.2,
  Puebla: 3.2,
  Birmingham: 3.2,
  Brisbane: 3.2,
  GuatemalaCity: 3.2,
  Guayaquil: 3.2,
  Kathmandu: 3.1,
  Cleveland: 3.1,
  Manchester: 3.1,
  Izmir: 3.0,
  Kumasi: 3.0,
  Pyongyang: 3.0,
  Bhilai: 2.9,
  Lanzhou: 2.9,
  Cali: 2.9,
  Hamburg: 2.9,
  Tangshan: 2.9,
  Vancouver: 2.9,
  Xuzhou: 2.9,
  Huizhou: 2.8,
  Sana_a: 2.8,
  Cincinnati: 2.8,
  Kaohsiung: 2.8,
  Gujranwala: 2.8,
  Taegu: 2.8,
  Fukuoka: 2.8,
  Cebu: 2.7,
  Quito: 2.7,
  Brussels: 2.7,
  Coimbatore: 2.7,
  TelAviv_Jaffa: 2.7,
  Lusaka: 2.7,
  Patna: 2.7,
  Tunis: 2.7,
  Anshan: 2.6,
  Budapest: 2.6,
  Maracaibo: 2.6,
  Ouagadougou: 2.6,
  Baku: 2.6,
  Luoyang: 2.6,
  Conakry: 2.5,
  Dammam: 2.5,
  Sapporo: 2.5,
  Amsterdam: 2.5,
  Charlotte: 2.5,
  Jiangyin: 2.5,
  Lisbon: 2.5,
  SaltLakeCity: 2.5,
  Doha: 2.4,
  Bhopal: 2.4,
  Goiânia: 2.4,
  Portland: 2.4,
  Taichung: 2.4,
  Stuttgart: 2.4,
  SanJosé: 2.4,
  Warsaw: 2.4,
  Asunción: 2.4,
  Chandigarh: 2.4,
  Katowice: 2.4,
  Peshawar: 2.4,
  PortHarcourt: 2.4,
  StLouis: 2.4,
  Toluca: 2.3,
  Agra: 2.3,
  Taizhou: 2.3,
  HyderabadPakistan: 2.3,
  LasVegas: 2.3,
  Maputo: 2.3,
  Brazzaville: 2.3,
  Munich: 2.3,
  Semarang: 2.3,
  Vienna: 2.3,
  Baotou: 2.2,
  Belém: 2.2,
  Havana: 2.2,
  SanAntonio: 2.2,
  Stockholm: 2.2,
  Vadodara: 2.2,
  Bucharest: 2.2,
  Lubumbashi: 2.2,
  Manaus: 2.2,
  Okayama: 2.2,
  Vishakhapatnam: 2.2,
  Yantai: 2.2,
  Leeds: 2.2,
  SantaCruz: 2.2,
  GeorgeTown: 2.1,
  LaPaz: 2.1,
  Mecca: 2.1,
  Xinxiang: 2.1,
  Alma_Ata: 2.1,
  Barranquilla: 2.1,
  Lomé: 2.1,
  Multan: 2.1,
  Baoding: 2.1,
  Bursa: 2.1,
  Mbuji_Mayi: 2.1,
  Nasik: 2.1,
  Perth: 2.1,
  PhnomPenh: 2.1,
  Sacramento: 2.1,
  Harare: 2.1,
  Linyi: 2.1,
  Pittsburgh: 2.1,
  Rabat: 2.1,
  Cixi: 2.0,
  Indianapolis: 2.0,
  Kitakyushu: 2.0,
  Liuzhou: 2.0,
  Minsk: 2.0,
  ValenciaVenuezuela: 2.0,
  Vijayawada: 2.0,
  KansasCity: 2.0,
  Nantong: 2.0,
  Weifang: 2.0,
  Huai_an: 2.0,
  Ludhiana: 2.0,
  Lyon: 2.0,
  Tijuana: 2.0,
  Austin: 2.0,
  Gaza: 2.0,
  Yangzhou: 2.0,
  León: 1.9,
  Mogadishu: 1.9,
  Benares: 1.9,
  Yogyakarta: 1.9,
  Huainan: 1.9,
  SanJuan: 1.9,
  Aleppo: 1.9,
  Bhubaneswar: 1.9,
  SanSalvador: 1.9,
  Makassar: 1.9,
  Rajkot: 1.9,
  Hiroshima: 1.9,
  Kaduna: 1.9,
  Liverpool: 1.9,
  Xiangyang: 1.9,
  Hohhot: 1.9,
  Haikou: 1.9,
  Montevideo: 1.9,
  Vitória: 1.9,
  ValenciaSpain: 1.8,
  Cotonou: 1.8,
  Tabriz: 1.8,
  Aurangabad: 1.8,
  Freetown: 1.8,
  Madurai: 1.8,
  Shiraz: 1.8,
  Columbus: 1.8,
  Beirut: 1.8,
  Malang: 1.8,
  Zhuhai: 1.8,
  Adana: 1.7,
  Meerut: 1.7,
  Santos: 1.7,
  NizhnyNovgorod: 1.7,
  Palembang: 1.7,
  Anyang: 1.7,
  Hartford: 1.7,
  Hengyang: 1.7,
  Novosibirsk: 1.7,
  Glasgow: 1.7,
  Copenhagen: 1.7,
  Córdoba: 1.7,
  Gaziantep: 1.7,
  Handan: 1.7,
  Jamshedpur: 1.7,
  Yekaterinburg: 1.7,
  Marseille: 1.7,
  Raleigh: 1.7,
  Yiwu: 1.7,
  BeninCity: 1.7,
  Datong: 1.7,
  Kharkiv: 1.6,
  Turin: 1.6,
  Surakarta: 1.6,
  Daqing: 1.6,
  Āsansol: 1.6,
  VirginiaBeach: 1.6,
  Kwangju: 1.6,
  Srinagar: 1.6,
  Cochin: 1.6,
  Monrovia: 1.6,
  Mannheim: 1.6,
  Davao: 1.6,
  Sheffield: 1.6,
  Guilin: 1.6,
  Mandalay: 1.6,
  Denpasar: 1.6,
  Milwaukee: 1.6,
  Medina: 1.5,
  Bengbu: 1.5,
  PanamaCity: 1.5,
  Taejon: 1.5,
  Jilin: 1.5,
  Porto: 1.5,
  Manama: 1.5,
  Basra: 1.5,
  Huaibei: 1.5,
  Xingtai: 1.5,
  AbuDhabi: 1.5,
  Calgary: 1.5,
  CiudadJuárez: 1.5,
  Ganzhou: 1.5,
  Sendai: 1.5,
  Yerevan: 1.5,
  Angeles: 1.5,
  Jabalpur: 1.5,
  Jodhpur: 1.5,
  Nashville: 1.5,
  Newcastle: 1.5,
  Oran: 1.5,
  Wuhu: 1.5,
  Zhangjiakou: 1.5,
  Jiaozuo: 1.5,
  Yinchuan: 1.5,
  Allahabad: 1.5,
  Xining: 1.5,
  Jacksonville: 1.5,
  Tai_an: 1.5,
  Donetsk: 1.4,
  Prague: 1.4,
  Querétaro: 1.4,
  SãoLuís: 1.4,
  Muscat: 1.4,
  Ranchi: 1.4,
  Zurich: 1.4,
  Belgrade: 1.4,
  Maoming: 1.4,
  Maracay: 1.4,
  Yancheng: 1.4,
  Auckland: 1.4,
  Chelyabinsk: 1.4,
  Cochabamba: 1.4,
  Natal: 1.4,
  Ndjamena: 1.4,
  Volgograd: 1.4,
  Mosul: 1.4,
  Amritsar: 1.4,
  Gwalior: 1.4,
  Tirupur: 1.4,
  UlanBator: 1.4,
  Xiangtan: 1.4,
  Ashgabat: 1.4,
  Batam: 1.4,
  Dnepropetrovsk: 1.4,
  Dublin: 1.4,
  Ahvaz: 1.4,
  Dhanbad: 1.4,
  Nottingham: 1.4,
  Putian: 1.4,
  Yichang: 1.4,
  Edmonton: 1.4,
  Kotā: 1.4,
  Rosario: 1.4,
  Torreón: 1.4,
  Buffalo: 1.4,
  Chonburi: 1.4,
  PortElizabeth: 1.4,
  Tbilisi: 1.4,
  Adelaide: 1.3,
  Tananarive: 1.3,
  Harrisburg: 1.3,
  Qinhuangdao: 1.3,
  Zhuzhou: 1.3,
  Managua: 1.3,
  Bareilly: 1.3,
  Hamamatsu: 1.3,
  Tainan: 1.3,
  Zhanjiang: 1.3,
  Antalya: 1.3,
  Barquisimeto: 1.3,
  Helsinki: 1.3,
  Konya: 1.3,
  McAllen: 1.3,
  Niamey: 1.3,
  Rostov_on_Don: 1.3,
  Samara: 1.3,
  Sofia: 1.3,
  Lille: 1.3,
  Qom: 1.3,
  Sevilla: 1.3,
  Fes: 1.3,
  Nouakchott: 1.3,
  Bucaramanga: 1.3,
  Kazan: 1.3,
  Morādābād: 1.3,
  Nanyang: 1.3,
  Stockton: 1.3,
  Benguela: 1.3,
  Ottawa: 1.3,
  Tripoli: 1.3,
  Zunyi: 1.3,
  Alīgarh: 1.2,
  Jining: 1.2,
  Kananga: 1.2,
  Mianyang: 1.2,
  Mysore: 1.2,
  Rizhao: 1.2,
  SanLuisPotosí: 1.2,
  Antwerp: 1.2,
  Mombasa: 1.2,
  Nanchong: 1.2,
  Pekanbaru: 1.2,
  Fuyang: 1.2,
  Jingzhou: 1.2,
  Maiduguri: 1.2,
  Naha: 1.2,
  SanPedroSula: 1.2,
  Tiruchirappalli: 1.2,
  BandarLampung: 1.2,
  Baoji: 1.2,
  Karawang: 1.2,
  MelbourneUS: 1.2,
  Nuremberg: 1.2,
  Onitsha: 1.2,
  Weihai: 1.2,
  Agadir: 1.2,
  Bangui: 1.2,
  Oslo: 1.2,
  Kigali: 1.2,
  Luzhou: 1.2,
  Ma_anshan: 1.2,
  Pointe_Noire: 1.2,
  Aguascalientes: 1.2,
  Changde: 1.2,
  Kisangani: 1.2,
  Memphis: 1.2,
  Southampton: 1.2,
  Aba: 1.2,
  Hanover: 1.2,
  Kumamoto: 1.2,
  Lianyungang: 1.2,
  Mérida: 1.2,
  Serang: 1.2,
  Tegucigalpa: 1.2,
  Yueyang: 1.2,
  Zhenjiang: 1.2,
  Gauhati: 1.1,
  Hubli_Dharwar: 1.1,
  OklahomaCity: 1.1,
  Quetta: 1.1,
  Shizuoka: 1.1,
  Sousse: 1.1,
  Wanzhou: 1.1,
  Cartagena: 1.1,
  Ulanhad: 1.1,
  Greensboro: 1.1,
  JoãoPessoa: 1.1,
  Krasnoyarsk: 1.1,
  Suzhou: 1.1,
  Ufa: 1.1,
  Cirebon: 1.1,
  Jullundur: 1.1,
  Kaifeng: 1.1,
  Marrakesh: 1.1,
  Nur_Sultan: 1.1,
  Omsk: 1.1,
  Cangnan: 1.1,
  Maceió: 1.1,
  Odessa: 1.1,
  Perm: 1.1,
  Salem: 1.1,
  Tangier: 1.1,
  Ulsan: 1.1,
  Benxi: 1.1,
  Jinzhou: 1.1,
  Khulna: 1.1,
  Erbil: 1.1,
  Bishkek: 1.1,
  CapeCoral: 1.1,
  Kayseri: 1.1,
  Mendoza: 1.1,
  Saratov: 1.1,
  Sholapur: 1.1,
  Arequipa: 1.1,
  Bordeaux: 1.1,
  Touba: 1.1,
  Ilorin: 1.1,
  Qingyuan: 1.1,
  Richmond: 1.1,
  Lilongwe: 1.1,
  Louisville: 1.1,
  Mexicali: 1.1,
  Tengzhou: 1.1,
  Voronezh: 1.1,
  Zaozhuang: 1.1,
  Changshu: 1.1,
  Cuernavaca: 1.1,
  Qiqihar: 1.1,
  Shymkent: 1.1,
  Suqian: 1.1,
  Changwon: 1.0,
  Changzhi: 1.0,
  Diyarbakır: 1.0,
  Pingxiang: 1.0,
  Teresina: 1.0,
  Toulouse: 1.0,
  ElPaso: 1.0,
  Kirkuk: 1.0,
  Málaga: 1.0,
  Panjin: 1.0,
  Yibin: 1.0,
  Zigong: 1.0,
  Jos: 1.0,
  Kermānshāh: 1.0,
  Calicut: 1.0,
  Pingdingshan: 1.0,
  SanMigueldeTucumán: 1.0,
  Shiliguri: 1.0,
  Valparaíso: 1.0,
  DaNang: 1.0,
  Dushanbe: 1.0,
  Florence: 1.0,
  NewOrleans: 1.0,
  Yingkou: 1.0,
  Banjul: 1.0,
  Bremen: 1.0,
  Enugu: 1.0,
  Florianópolis: 1.0,
  Hechuan: 1.0,
  Honolulu: 1.0,
  Jiaxing: 1.0,
  Mersin: 1.0,
  Morelia: 1.0,
  Tucson: 1.0,
  Warri: 1.0,
  Zaria: 1.0
}; // https://en.wikipedia.org/wiki/List_of_causes_of_death_by_rate
// data by deaths per 100,000

const MortalityRates$1 = {
  'Cardiovascular': 268.8,
  'InfectiousAndParasitic': 211.3,
  'CoronaryArtery': 115.8,
  'MalignantNeoplasms': 114.4,
  'Cerebrovascular': 88.5,
  'RespiratoryInfections': 63.7,
  'LowerRespiratoryTractInfections': 62.4,
  'Respiratory': 59.5,
  'UnintentionalInjuries': 57.0,
  'HIV': 44.6,
  'ChronicObstructivePulmonary': 44.1,
  'PerinatalConditions': 39.6,
  'Digestive': 31.6,
  'Diarrhea': 28.9,
  'IntentionalInjuries': 26.0,
  'Tuberculosis': 25.2,
  'Malaria': 20.4,
  'LungCancer': 20.0
};
const PowerCars$1 = {
  Evija: 1471,
  Speedtail: 772,
  Valhalla: 746,
  SF90Stradale: 735,
  SiánFKP37: 603,
  Jesko: 1177,
  Valkyrie: 865,
  Battista: 1408,
  'TSR-S': 878,
  One: 813,
  ChallengerDemon: 626,
  Chiron: 1103,
  Regera: 1103,
  AgeraRS: 1000,
  LaFerrari: 708,
  P1: 673,
  '918Spyder': 652,
  VeyronSuperSport: 883,
  UltimateAeroTT: 960,
  ST1: 812,
  CCR: 601
}; // https://en.wikipedia.org/wiki/List_of_recessions_in_the_United_States

const Recessions$1 = {
  1929: -26.7,
  1937: -18.2,
  1945: -12.7,
  1949: -1.7,
  1953: -2.6,
  1958: -3.7,
  1960: -1.6,
  1969: -0.6,
  1973: -3.2,
  1980: -2.2,
  1981: -2.7,
  1990: -1.4,
  2001: -0.3,
  2008: -5.1
};

function _defineProperty$3(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class Foba$4 extends Flopper {}

_defineProperty$3(Foba$4, "ArmSales", ArmSales$1);

_defineProperty$3(Foba$4, "BrentPrices", BrentPrices$1);

_defineProperty$3(Foba$4, "CityPopulations", CityPopulations$1);

_defineProperty$3(Foba$4, "MortalityRates", MortalityRates$1);

_defineProperty$3(Foba$4, "PowerCars", PowerCars$1);

_defineProperty$3(Foba$4, "Recessions", Recessions$1);

const CarPlants$1 = {
  SantAgata: 'Lamborghini',
  Angelholm: 'Koenigsegg',
  Molsheim: 'Bugatti',
  Gaydon: 'Aston Martin',
  Maranello: 'Ferrari',
  Stuttgart: 'Porsche',
  Modena: 'Pagani',
  Neckarsulm: 'Audi',
  Crewe: 'Bentley',
  Woking: 'McLaren',
  Hethel: 'Lotus'
};
const FilmActors$1 = {
  'Reversal of Fortune': 'Jeremy Irons',
  'Dances with Wolves': 'Kevin Costner',
  'Awakenings': 'Robert De Niro',
  'Cyrano de Bergerac': 'Gérard Depardieu',
  'The Field': 'Richard Harris',
  'The Silence of the Lambs': 'Anthony Hopkins',
  'Bugsy': 'Warren Beatty',
  'Cape Fear': 'Robert De Niro',
  'The Prince of Tides': 'Nick Nolte',
  'The Fisher King': 'Robin Williams',
  'Scent of a Woman': 'Al Pacino',
  'Chaplin': 'Robert Downey, Jr.',
  'Unforgiven': 'Clint Eastwood',
  'The Crying Game': 'Stephen Rea',
  'Malcolm X': 'Denzel Washington',
  'Philadelphia': 'Tom Hanks',
  'In the Name of the Father': 'Daniel Day-Lewis',
  'What\'s Love Got to Do with It': 'Laurence Fishburne',
  'The Remains of the Day': 'Anthony Hopkins',
  'Schindler\'s List': 'Liam Neeson',
  'Forrest Gump': 'Tom Hanks',
  'The Shawshank Redemption': 'Morgan Freeman',
  'The Madness of King George': 'Nigel Hawthorne',
  'Nobody\'s Fool': 'Paul Newman',
  'Pulp Fiction': 'John Travolta',
  'Leaving Las Vegas': 'Nicolas Cage',
  'Mr. Holland\'s Opus': 'Richard Dreyfuss',
  'Nixon': 'Anthony Hopkins',
  'Dead Man Walking': 'Sean Penn',
  'Il Postino': 'Massimo Troisi',
  'Shine': 'Geoffrey Rush',
  'Jerry Maguire': 'Tom Cruise',
  'The English Patient': 'Ralph Fiennes',
  'The People vs. Larry Flynt': 'Woody Harrelson',
  'Sling Blade': 'Billy Bob Thornton',
  'As Good as It Gets': 'Jack Nicholson',
  'Good Will Hunting': 'Matt Damon',
  'The Apostle': 'Robert Duvall',
  'Ulee\'s Gold': 'Peter Fonda',
  'Wag the Dog': 'Dustin Hoffman',
  'Life Is Beautiful': 'Roberto Benigni',
  'Saving Private Ryan': 'Tom Hanks',
  'Gods and Monsters': 'Ian McKellen',
  'Affliction': 'Nick Nolte',
  'American History X': 'Edward Norton',
  'American Beauty': 'Kevin Spacey',
  'The Insider': 'Russell Crowe',
  'The Straight Story': 'Richard Farnsworth',
  'Sweet and Lowdown': 'Sean Penn',
  'The Hurricane': 'Denzel Washington',
  'Gladiator': 'Russell Crowe',
  'Before Night Falls': 'Javier Bardem',
  'Cast Away': 'Tom Hanks',
  'Pollock': 'Ed Harris',
  'Quills': 'Geoffrey Rush',
  'Training Day': 'Denzel Washington',
  'A Beautiful Mind': 'Russell Crowe',
  'I Am Sam': 'Sean Penn',
  'Ali': 'Will Smith',
  'In the Bedroom': 'Tom Wilkinson',
  'The Pianist': 'Adrien Brody',
  'Adaptation.': 'Nicolas Cage',
  'The Quiet American': 'Michael Caine',
  'Gangs of New York': 'Daniel Day-Lewis',
  'About Schmidt': 'Jack Nicholson',
  'Mystic River': 'Sean Penn',
  'Pirates of the Caribbean: The Curse of the Black Pearl': 'Johnny Depp',
  'House of Sand and Fog': 'Ben Kingsley',
  'Cold Mountain': 'Jude Law',
  'Lost in Translation': 'Bill Murray',
  'Ray': 'Jamie Foxx',
  'Hotel Rwanda': 'Don Cheadle',
  'Finding Neverland': 'Johnny Depp',
  'The Aviator': 'Leonardo DiCaprio',
  'Million Dollar Baby': 'Clint Eastwood',
  'Capote': 'Philip Seymour Hoffman',
  'Hustle & Flow': 'Terrence Howard',
  'Brokeback Mountain': 'Heath Ledger',
  'Walk the Line': 'Joaquin Phoenix',
  'Good Night, and Good Luck': 'David Strathairn',
  'The Last King of Scotland': 'Forest Whitaker',
  'Blood Diamond': 'Leonardo DiCaprio',
  'Half Nelson': 'Ryan Gosling',
  'Venus': 'Peter O\'Toole',
  'The Pursuit of Happyness': 'Will Smith',
  'There Will Be Blood': 'Daniel Day-Lewis',
  'Michael Clayton': 'George Clooney',
  'Sweeney Todd: The Demon Barber of Fleet Street': 'Johnny Depp',
  'In the Valley of Elah': 'Tommy Lee Jones',
  'Eastern Promises': 'Viggo Mortensen',
  'Milk': 'Sean Penn',
  'The Visitor': 'Richard Jenkins',
  'Frost/Nixon': 'Frank Langella',
  'The Curious Case of Benjamin Button': 'Brad Pitt',
  'The Wrestler': 'Mickey Rourke',
  'Crazy Heart': 'Jeff Bridges',
  'Up in the Air': 'George Clooney',
  'A Single Man': 'Colin Firth',
  'Invictus': 'Morgan Freeman',
  'The Hurt Locker': 'Jeremy Renner'
};
const FilmActresses$1 = {
  'Misery': 'Kathy Bates',
  'The Grifters': 'Anjelica Huston',
  'Pretty Woman': 'Julia Roberts',
  'Postcards from the Edge': 'Meryl Streep',
  'Mr. and Mrs. Bridge': 'Joanne Woodward',
  'The Silence of the Lambs': 'Jodie Foster',
  'Thelma & Louise': 'Geena Davis',
  'Rambling Rose': 'Laura Dern',
  'For the Boys': 'Bette Midler',
  'Thelma & Louise_': 'Susan Sarandon',
  'Howards End': 'Emma Thompson',
  'Indochine': 'Catherine Deneuve',
  'Passion Fish': 'Mary McDonnell',
  'Love Field': 'Michelle Pfeiffer',
  'Lorenzo\'s Oil': 'Susan Sarandon',
  'The Piano': 'Holly Hunter',
  'What\'s Love Got to Do with It': 'Angela Bassett',
  'Six Degrees of Separation': 'Stockard Channing',
  'The Remains of the Day': 'Emma Thompson',
  'Shadowlands': 'Debra Winger',
  'Blue Sky': 'Jessica Lange',
  'Nell': 'Jodie Foster',
  'Tom & Viv': 'Miranda Richardson',
  'Little Women': 'Winona Ryder',
  'The Client': 'Susan Sarandon',
  'Dead Man Walking': 'Susan Sarandon',
  'Leaving Las Vegas': 'Elisabeth Shue',
  'Casino': 'Sharon Stone',
  'The Bridges of Madison County': 'Meryl Streep',
  'Sense and Sensibility': 'Emma Thompson',
  'Fargo': 'Frances McDormand',
  'Secrets & Lies': 'Brenda Blethyn',
  'Marvin\'s Room': 'Diane Keaton',
  'The English Patient': 'Kristin Scott Thomas',
  'Breaking the Waves': 'Emily Watson',
  'As Good as It Gets': 'Helen Hunt',
  'The Wings of the Dove': 'Helena Bonham Carter',
  'Afterglow': 'Julie Christie',
  'Mrs. Brown': 'Judi Dench',
  'Titanic': 'Kate Winslet',
  'Shakespeare in Love': 'Gwyneth Paltrow',
  'Elizabeth': 'Cate Blanchett',
  'Central Station': 'Fernanda Montenegro',
  'One True Thing': 'Meryl Streep',
  'Hilary and Jackie': 'Emily Watson',
  'Boys Don\'t Cry': 'Hilary Swank',
  'American Beauty': 'Annette Bening',
  'Tumbleweeds': 'Janet McTeer',
  'The End of the Affair': 'Julianne Moore',
  'Music of the Heart': 'Meryl Streep',
  'Erin Brockovich': 'Julia Roberts',
  'The Contender': 'Joan Allen',
  'Chocolat': 'Juliette Binoche',
  'Requiem for a Dream': 'Ellen Burstyn',
  'You Can Count on Me': 'Laura Linney',
  'Monster\'s Ball': 'Halle Berry',
  'Iris': 'Judi Dench',
  'Moulin Rouge!': 'Nicole Kidman',
  'In the Bedroom': 'Sissy Spacek',
  'Bridget Jones\'s Diary': 'Renée Zellweger',
  'The Hours': 'Nicole Kidman',
  'Frida': 'Salma Hayek',
  'Unfaithful': 'Diane Lane',
  'Far from Heaven': 'Julianne Moore',
  'Chicago': 'Renée Zellweger',
  'Monster': 'Charlize Theron',
  'Whale Rider': 'Keisha Castle-Hughes',
  'Something\'s Gotta Give': 'Diane Keaton',
  'In America': 'Samantha Morton',
  '21 Grams': 'Naomi Watts',
  'Million Dollar Baby': 'Hilary Swank',
  'Being Julia': 'Annette Bening',
  'Maria Full of Grace': 'Catalina Sandino Moreno',
  'Vera Drake': 'Imelda Staunton',
  'Eternal Sunshine of the Spotless Mind': 'Kate Winslet',
  'Walk the Line': 'Reese Witherspoon',
  'Mrs Henderson Presents': 'Judi Dench',
  'Transamerica': 'Felicity Huffman',
  'Pride & Prejudice': 'Keira Knightley',
  'North Country': 'Charlize Theron',
  'The Queen': 'Helen Mirren',
  'Volver': 'Penélope Cruz',
  'Notes on a Scandal': 'Judi Dench',
  'The Devil Wears Prada': 'Meryl Streep',
  'Little Children': 'Kate Winslet',
  'La Vie en Rose': 'Marion Cotillard',
  'Elizabeth: The Golden Age': 'Cate Blanchett',
  'Away from Her': 'Julie Christie',
  'The Savages': 'Laura Linney',
  'Juno': 'Ellen Page',
  'The Reader': 'Kate Winslet',
  'Rachel Getting Married': 'Anne Hathaway',
  'Changeling': 'Angelina Jolie',
  'Frozen River': 'Melissa Leo',
  'Doubt': 'Meryl Streep',
  'The Blind Side': 'Sandra Bullock',
  'The Last Station': 'Helen Mirren',
  'An Education': 'Carey Mulligan',
  'Precious': 'Gabourey Sidibe',
  'Julie & Julia': 'Meryl Streep'
};
const FilmDirectors$1 = {
  'Dances with Wolves': 'Kevin Costner',
  'The Godfather Part III': 'Francis Ford Coppola',
  'The Grifters': 'Stephen Frears',
  'Reversal of Fortune': 'Barbet Schroeder',
  'Goodfellas': 'Martin Scorsese',
  'The Silence of the Lambs': 'Jonathan Demme',
  'Bugsy': 'Barry Levinson',
  'Thelma & Louise': 'Ridley Scott',
  'Boyz n the Hood': 'John Singleton',
  'JFK': 'Oliver Stone',
  'Unforgiven': 'Clint Eastwood',
  'The Player': 'Robert Altman',
  'Scent of a Woman': 'Martin Brest',
  'Howards End': 'James Ivory',
  'The Crying Game': 'Neil Jordan',
  'Schindler\'s List': 'Steven Spielberg',
  'Short Cuts': 'Robert Altman',
  'The Piano': 'Jane Campion',
  'The Remains of the Day': 'James Ivory',
  'In the Name of the Father': 'Jim Sheridan',
  'Forrest Gump': 'Robert Zemeckis',
  'Bullets Over Broadway': 'Woody Allen',
  'Three Colors: Red': 'Krzysztof Kieślowski',
  'Quiz Show': 'Robert Redford',
  'Pulp Fiction': 'Quentin Tarantino',
  'Braveheart': 'Mel Gibson',
  'Leaving Las Vegas': 'Mike Figgis',
  'Babe': 'Chris Noonan',
  'Il Postino': 'Michael Radford',
  'Dead Man Walking': 'Tim Robbins',
  'The English Patient': 'Anthony Minghella',
  'Fargo': 'Joel Coen',
  'The People vs. Larry Flynt': 'Miloš Forman',
  'Shine': 'Scott Hicks',
  'Secrets & Lies': 'Mike Leigh',
  'Titanic': 'James Cameron',
  'The Full Monty': 'Peter Cattaneo',
  'The Sweet Hereafter': 'Atom Egoyan',
  'L.A. Confidential': 'Curtis Hanson',
  'Good Will Hunting': 'Gus Van Sant',
  'Saving Private Ryan': 'Steven Spielberg',
  'Life Is Beautiful': 'Roberto Benigni',
  'Shakespeare in Love': 'John Madden',
  'The Thin Red Line': 'Terrence Malick',
  'The Truman Show': 'Peter Weir',
  'American Beauty': 'Sam Mendes',
  'The Cider House Rules': 'Lasse Hallström',
  'Being John Malkovich': 'Spike Jonze',
  'The Insider': 'Michael Mann',
  'The Sixth Sense': 'M. Night Shyamalan',
  'Traffic': 'Steven Soderbergh',
  'Billy Elliot': 'Stephen Daldry',
  'Crouching Tiger, Hidden Dragon': 'Ang Lee',
  'Gladiator': 'Ridley Scott',
  'Erin Brockovich': 'Steven Soderbergh',
  'A Beautiful Mind': 'Ron Howard',
  'Gosford Park': 'Robert Altman',
  'The Lord of the Rings: The Fellowship of the Ring': 'Peter Jackson',
  'Mulholland Drive': 'David Lynch',
  'The Pianist': 'Roman Polanski',
  'Black Hawk Down': 'Ridley Scott',
  'Talk to Her': 'Pedro Almodóvar',
  'The Hours': 'Stephen Daldry',
  'Chicago': 'Rob Marshall',
  'The Lord of the Rings: The Return of the King': 'Peter Jackson',
  'Gangs of New York': 'Martin Scorsese',
  'Lost in Translation': 'Sofia Coppola',
  'Mystic River': 'Clint Eastwood',
  'City of God': 'Fernando Meirelles',
  'Master and Commander: The Far Side of the World': 'Peter Weir',
  'Million Dollar Baby': 'Clint Eastwood',
  'Ray': 'Taylor Hackford',
  'Vera Drake': 'Mike Leigh',
  'Sideways': 'Alexander Payne',
  'The Aviator': 'Martin Scorsese',
  'Brokeback Mountain': 'Ang Lee',
  'Good Night, and Good Luck.': 'George Clooney',
  'Crash': 'Paul Haggis',
  'Capote': 'Bennett Miller',
  'Munich': 'Steven Spielberg',
  'The Departed': 'Martin Scorsese',
  'Letters from Iwo Jima': 'Clint Eastwood',
  'The Queen': 'Stephen Frears',
  'Babel': 'Alejandro González Iñárritu',
  'United 93': 'Paul Greengrass',
  'No Country for Old Men': 'Joel & Ethan Coen',
  'There Will Be Blood': 'Paul Thomas Anderson',
  'Michael Clayton': 'Tony Gilroy',
  'Juno': 'Jason Reitman',
  'The Diving Bell and the Butterfly': 'Julian Schnabel',
  'Slumdog Millionaire': 'Danny Boyle',
  'The Reader': 'Stephen Daldry',
  'The Curious Case of Benjamin Button': 'David Fincher',
  'Frost/Nixon': 'Ron Howard',
  'Milk': 'Gus Van Sant',
  'Avatar': 'James Cameron',
  'The Hurt Locker': 'Kathryn Bigelow',
  'Precious: Based on the Novel "Push" by Sapphire': 'Lee Daniels',
  'Up in the Air': 'Jason Reitman',
  'Inglourious Basterds': 'Quentin Tarantino'
};
const MilitaryRobots$1 = {
  MechanicalHound: 'Fahrenheit 451',
  AMEE: 'Red Planet',
  SIMON: 'Lara Croft Tomb Raider',
  ED209: 'RoboCop',
  BattleRobotT1: 'Terminator 3 Rise of the Machines',
  Johnny5: 'Short Circuit',
  MARK: 'Hardware',
  EDI: 'Stealth',
  VTOLCraftT1: 'Terminator 3 Rise of the Machines',
  CyberdyneT800: 'Terminator series',
  EosB1: 'Star Wars Ep. I/II/III',
  EosB2: 'Star Wars Ep. II/III',
  HolowanMagnaGuards: 'Star Wars Ep. III',
  Decepticons: 'Transformers',
  HectorModel: 'Saturn 3',
  STAR: 'The Black Hole',
  CylonCenturion: 'Battlestar Galactica',
  Protectron: 'Fallout',
  SentryBot: 'Fallout',
  LibertyPrime: 'Fallout',
  CyberdyneT1000: 'Terminator 2 Judgment Day',
  Terminatrix: 'Terminator 3 Rise of the Machines',
  Synth: 'Fallout',
  Sentinels: 'The Matrix series',
  RobotB9: 'Lost in Space',
  Droideka: 'Star Wars Ep. I,II,III',
  R2D2: 'Star Wars series',
  VINCENT: 'The Black Hole',
  BOB: 'The Black Hole',
  Maximilian: 'The Black Hole',
  MisterGusty: 'Fallout series',
  SuperSentinels: 'Halo 1/2/3',
  Screamers: 'Screamers',
  APU: 'The Matrix Revolutions',
  IronManSuit: 'Iron Man',
  AMP: 'Avatar',
  MANTIS: 'M.A.N.T.I.S.',
  PoweredInfantryArmorT51: 'Fallout series'
};
const Pastas$1 = {
  conchiglie: 'seashell shaped, usually furrowed (rigate)',
  chifferi: 'short and wide macaroni',
  farfalle: 'bow tie or butterfly shaped',
  fusilli: 'long, thick, corkscrew-shaped pasta that may be solid or hollow',
  gnocchi: 'lobed shells. Not to be confused with gnocchi dumplings',
  lasagna: 'square or rectangle sheets of pasta',
  linguine: 'flattened spaghetti',
  pennine: 'medium length tubes with ridges, cut diagonally at both ends',
  ravioli: 'wwo squares of pasta on top of another, stuffed with fill',
  spaghetti: 'long, thin, cylindrical pasta of Italian origin'
};

function _defineProperty$4(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class Foba$5 extends Flopper {}

_defineProperty$4(Foba$5, "CarPlants", CarPlants$1);

_defineProperty$4(Foba$5, "FilmActors", FilmActors$1);

_defineProperty$4(Foba$5, "FilmActresses", FilmActresses$1);

_defineProperty$4(Foba$5, "FilmDirectors", FilmDirectors$1);

_defineProperty$4(Foba$5, "MilitaryRobots", MilitaryRobots$1);

_defineProperty$4(Foba$5, "Pastas", Pastas$1);

const Objects = {
  array: Foba$2.flop(),
  map: new Map(Object.entries(Foba$4.flop())),
  set: new Set(Foba$2.flop()),
  object: Foba$5.flop(),
  function: x => console.log(x)
};

const Strings = {
  'str NaN': 'NaN',
  'str null': 'null',
  'str undefined': 'undefined',
  'str true': 'true',
  'str false': 'false',
  'str 0': '0',
  'str -1': '-1',
  'str -1.5': '-1.5',
  'str 0.42': '0.42',
  'str .42': '.42',
  'str 1.2E+9': '1.2E+9',
  'str 0xFF': '0xFF',
  'str Inf..': 'Infinity',
  'str empty': '',
  'str space': ' ',
  'str [Ob]': '[object Object]',
  'str dot': '.',
  'str +': '+',
  'str -': '-',
  'str 99,999': '99,999',
  'str date': '2077-06-04',
  'str #abcdef': '#abcdef',
  'str 1.2.3': '1.2.3',
  'str blah': 'blah'
};

export { Arrays, Basics, Numerics, Objects, Strings };
