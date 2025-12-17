import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const collections = [
  {
    name: 'Lawn Pakka Tanka',
    slug: 'lawn-pakka-tanka',
    description: 'Allover shadow work with motifs on sleeves and back, and motifs on dupatta.',
    order: 1
  },
  {
    name: 'Cut Dana',
    slug: 'cut-dana',
    description: 'Lawn outfits with tarkashi gala and panel design in mirror work and phulkari embroidery.',
    order: 2
  },
  {
    name: 'Paper Lawn Shadow Work',
    slug: 'paper-lawn-shadow-work',
    description: 'Paper lawn outfits with allover embroidery on front, heavy sleeves, and back.',
    order: 3
  },
  {
    name: 'Paper Lawn Tarkashi',
    slug: 'paper-lawn-tarkashi',
    description: 'Paper lawn with intricate tarkashi gala and beautiful hand embroidery adorned with pearls and silver sequence.',
    order: 4
  },
  {
    name: 'Tarkashi & Pakka Tanka All Over',
    slug: 'tarkashi-pakka-tanka-all-over',
    description: 'Lawn outfits featuring tarkashi gala and panel design with mirror work and phulkari.',
    order: 5
  },
  {
    name: 'Embellished',
    slug: 'embellished',
    description: 'Lawn suits with allover aar embroidery on front, embellished with cutdana motifs.',
    order: 6
  },
  {
    name: 'Ajrak',
    slug: 'ajrak',
    description: 'Paper lawn outfits with intricate tarkashi gala and simple embroidery featuring mirror work.',
    order: 7
  },
  {
    name: 'Linen Ribbon',
    slug: 'linen-ribbon',
    description: 'Paper lawn outfits with intricate tarkashi gala and simple embroidery featuring mirror work and motifs.',
    order: 8
  },
  {
    name: 'Linen Floor Length',
    slug: 'linen-floor-length',
    description: 'Lawn suits with allover aar embroidery on front, embellished with cutdana motifs and chiffon dupatta.',
    order: 9
  },
  {
    name: 'Paper Lawn & Cotton Net',
    slug: 'paper-lawn-cotton-net',
    description: 'Paper lawn outfits with intricate tarkashi gala and simple embroidery featuring mirror work and motifs.',
    order: 10
  },
  {
    name: 'Cotton Net Chicken Kaari',
    slug: 'cotton-net-chicken-kaari',
    description: 'Cotton net with beautiful chicken kaari hand embroidery adorned with pearls and silver sequence.',
    order: 11
  },
  {
    name: 'Shalwar',
    slug: 'shalwar',
    description: 'Shadow work chikankari trousers with elegant embroidery.',
    order: 12
  },
  {
    name: 'Gota',
    slug: 'gota',
    description: 'Paper lawn with intricate tarkashi gala and simple embroidery with mirror work.',
    order: 13
  },
  {
    name: 'Dupatta',
    slug: 'dupatta',
    description: 'Chaadars with tarkashi and different embroidery techniques.',
    order: 14
  }
];

const products = [
  // Lawn Pakka Tanka Collection
  { name: 'Lawn Pakka Tanka', color: 'Peach on Peach', price: 4800, pieces: '3 pc', collection: 'lawn-pakka-tanka', description: 'Allover shadow work with motifs on sleeves and back, and motifs on dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374570/2_gtmvi7.jpg' },
  { name: 'Lawn Pakka Tanka', color: 'Green on Green', price: 4800, pieces: '3 pc', collection: 'lawn-pakka-tanka', description: 'Allover shadow work with motifs on sleeves and back, and motifs on dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374569/3_xwnauy.jpg' },
  { name: 'Lawn Pakka Tanka', color: 'Lemon on Lemon', price: 4800, pieces: '3 pc', collection: 'lawn-pakka-tanka', description: 'Allover shadow work with motifs on sleeves and back, and motifs on dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374569/4_d29sij.jpg' },
  { name: 'Lawn Pakka Tanka', color: 'White on Black', price: 4800, pieces: '3 pc', collection: 'lawn-pakka-tanka', description: 'Allover shadow work with motifs on sleeves and back, and motifs on dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374570/5_khaaqs.jpg' },
  { name: 'Lawn Pakka Tanka', color: 'Red on Red', price: 4800, pieces: '3 pc', collection: 'lawn-pakka-tanka', description: 'Allover shadow work with motifs on sleeves and back, and motifs on dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374570/6_h3osyy.jpg' },
  { name: 'Lawn Pakka Tanka', color: 'Lilac on Purple', price: 4800, pieces: '3 pc', collection: 'lawn-pakka-tanka', description: 'Allover shadow work with motifs on sleeves and back, and motifs on dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374569/7_be9zru.jpg' },
  { name: 'Lawn Pakka Tanka', color: 'Blue on Black', price: 4800, pieces: '3 pc', collection: 'lawn-pakka-tanka', description: 'Allover shadow work with motifs on sleeves and back, and motifs on dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374569/9_zuh6xq.jpg' },
  { name: 'Lawn Pakka Tanka', color: 'Sky Blue on Dark Blue', price: 4800, pieces: '3 pc', collection: 'lawn-pakka-tanka', description: 'Allover shadow work with motifs on sleeves and back, and motifs on dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374571/10_ghidbk.jpg' },
  { name: 'Lawn Pakka Tanka', color: 'Turquoise on Blue', price: 4800, pieces: '3 pc', collection: 'lawn-pakka-tanka', description: 'Allover shadow work with motifs on sleeves and back, and motifs on dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374571/11_k46oxb.jpg' },
  { name: 'Lawn Pakka Tanka', color: 'Apple Green', price: 3800, pieces: '3 pc', collection: 'lawn-pakka-tanka', description: 'Allover shadow work with motifs on sleeves and back, and motifs on dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374572/12_goml03.jpg' },
  { name: 'Lawn Pakka Tanka', color: 'Pink', price: 3800, pieces: '3 pc', collection: 'lawn-pakka-tanka', description: 'Allover shadow work with motifs on sleeves and back, and motifs on dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374571/13_kytb7y.jpg' },

  // Cut Dana Collection
  { name: 'Cut Dana', color: 'Maroon', price: 5200, pieces: '3 pc', collection: 'cut-dana', description: '3-piece lawn outfit with tarkashi gala and panel design in mirror work and phulkari embroidery.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374571/30_uk6eu6.jpg' },
  { name: 'Cut Dana', color: 'Rust', price: 5200, pieces: '3 pc', collection: 'cut-dana', description: '3-piece lawn outfit with tarkashi gala and panel design in mirror work and phulkari detailing.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374572/31_tszhvd.jpg' },
  { name: 'Cut Dana', color: 'Pink', price: 5200, pieces: '3 pc', collection: 'cut-dana', description: '3-piece lawn suit with tarkashi gala, mirror work, and traditional phulkari embroidery.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374572/32_hzg0vq.jpg' },
  { name: 'Cut Dana', color: 'Blue', price: 5200, pieces: '3 pc', collection: 'cut-dana', description: '3-piece lawn suit featuring tarkashi gala and phulkari mirror work with elegant finishing.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374572/34_kw05bt.jpg' },
  { name: 'Cut Dana', color: 'Burgundy', price: 5200, pieces: '3 pc', collection: 'cut-dana', description: '3-piece lawn outfit adorned with tarkashi gala, mirror work, and phulkari embroidery.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374573/35_j8qzh0.jpg' },
  
  // Paper Lawn Tarkashi Collection
  { name: 'Paper Lawn Tarkashi', color: 'Orange', price: 3800, pieces: '2 pc', quantity: 1, collection: 'paper-lawn-tarkashi', description: '2-piece shirt and dupatta in karandi fabric with hand embroidery adorned with pearls and silver sequence, featuring motifs on the back and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374573/42_ouvfou.jpg' },
  { name: 'Paper Lawn Tarkashi', color: 'Lilac', price: 3800, pieces: '2 pc', quantity: 1, collection: 'paper-lawn-tarkashi', description: '2-piece shirt and dupatta in karandi fabric with hand embroidery adorned with pearls and silver sequence, featuring motifs on the back and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374569/43_zukihe.jpg' },
  { name: 'Paper Lawn Tarkashi', color: 'Blue', price: 3800, pieces: '2 pc', quantity: 1, collection: 'paper-lawn-tarkashi', description: '2-piece shirt and dupatta in karandi fabric with hand embroidery adorned with pearls and silver sequence, featuring motifs on the back and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374570/45_q0orna.jpg' },
  { name: 'Paper Lawn Tarkashi', color: 'Beige', price: 3800, pieces: '2 pc', quantity: 1, collection: 'paper-lawn-tarkashi', description: '2-piece shirt and dupatta in karandi fabric with hand embroidery adorned with pearls and silver sequence, featuring motifs on the back and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374570/46_jbrqwy.jpg' },
  { name: 'Paper Lawn Tarkashi', color: 'Pink', price: 3800, pieces: '2 pc', quantity: 1, collection: 'paper-lawn-tarkashi', description: '2-piece shirt and dupatta in karandi fabric with hand embroidery adorned with pearls and silver sequence, featuring motifs on the back and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374570/47_txchlz.jpg' },
  { name: 'Paper Lawn Tarkashi', color: 'White', price: 3800, pieces: '2 pc', quantity: 1, collection: 'paper-lawn-tarkashi', description: '2-piece shirt and dupatta in karandi fabric with hand embroidery adorned with pearls and silver sequence, featuring motifs on the back and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374570/48_cogra5.jpg' },

  // Shalwar Collection
  { name: 'Shalwar', color: 'White', price: 2100, pieces: '1 pc', quantity: 1, collection: 'shalwar', description: 'Shadow work chikankari trousers.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374571/49_lwe5pk.jpg' },

  // Cotton Net Chicken Kaari Collection (additional items)
  { name: 'Cotton Net Chicken Kaari', color: 'Baby Pink', price: 6500, pieces: '2 pc', quantity: 1, collection: 'cotton-net-chicken-kaari', description: '2-piece shirt and dupatta in karandi fabric with hand embroidery adorned with pearls and silver sequence, featuring motifs on the back and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374571/50_g4wn6l.jpg' },
  { name: 'Cotton Net Chicken Kaari', color: 'Pastel Yellow', price: 6800, pieces: '2 pc', quantity: 1, collection: 'cotton-net-chicken-kaari', description: '2-piece shirt and dupatta in karandi fabric with hand embroidery adorned with pearls and silver sequence, featuring motifs on the back and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374571/51_qhr870.jpg' },
  { name: 'Cotton Net Chicken Kaari', color: 'Apple Green', price: 6800, pieces: '2 pc', quantity: 1, collection: 'cotton-net-chicken-kaari', description: '2-piece shirt and dupatta in karandi fabric with hand embroidery adorned with pearls and silver sequence, featuring motifs on the back and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374572/53_fwmmdb.jpg' },
  
  // Paper Lawn Shadow Work Collection
  { name: 'Paper Lawn Shadow Work', color: 'White', price: 3800, pieces: '2 pc', collection: 'paper-lawn-shadow-work', description: '2-piece paper lawn outfit with allover embroidery on front, heavy sleeves, and back. Dupatta features two-sided heavy borders and center motifs.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374573/38_y3uqc8.jpg' },
  { name: 'Paper Lawn Shadow Work', color: 'Ice Blue', price: 3800, pieces: '2 pc', collection: 'paper-lawn-shadow-work', description: '2-piece paper lawn set with heavy shadow embroidery on front, sleeves, and back. Dupatta has bordered motifs throughout.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374573/39_kolsqn.jpg' },
  { name: 'Paper Lawn Shadow Work', color: 'Apple Green', price: 3800, pieces: '2 pc', collection: 'paper-lawn-shadow-work', description: '2-piece paper lawn suit with fine shadow embroidery and detailed dupatta featuring motifs and heavy borders.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374573/40_imdrdf.jpg' },

  // Tarkashi & Pakka Tanka All Over Collection
  { name: 'Tarkashi & Pakka Tanka All Over', color: 'Pink', price: 5800, pieces: '2 pc', collection: 'tarkashi-pakka-tanka-all-over', description: 'Lawn outfit featuring tarkashi gala and panel design with mirror work and phulkari.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374572/57_kjazvn.jpg' },
  { name: 'Tarkashi & Pakka Tanka All Over', color: 'Blue', price: 5800, pieces: '2 pc', collection: 'tarkashi-pakka-tanka-all-over', description: 'Lawn outfit featuring tarkashi gala and panel design with mirror work and phulkari.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374572/59_zzv0v7.jpg' },
  { name: 'Tarkashi & Pakka Tanka All Over', color: 'Red', price: 5800, pieces: '2 pc', collection: 'tarkashi-pakka-tanka-all-over', description: 'Lawn outfit featuring tarkashi gala and panel design with mirror work and phulkari.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374573/61_ohjnan.jpg' },
  { name: 'Tarkashi & Pakka Tanka All Over', color: 'Yellow', price: 5800, pieces: '2 pc', collection: 'tarkashi-pakka-tanka-all-over', description: 'Lawn outfit featuring tarkashi gala and panel design with mirror work and phulkari.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374573/60_w2nre6.jpg' },

  // Embellished Collection
  { name: 'Embellished', color: 'Pink with Pearls', price: 6500, pieces: '3 pc', collection: 'embellished', description: '3-piece lawn suit with allover aar embroidery on front, embellished with cutdana motifs and chiffon dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374573/66_jq7buv.jpg' },
  { name: 'Embellished', color: 'Yellow with Pearls', price: 6500, pieces: '3 pc', collection: 'embellished', description: '3-piece lawn suit with allover aar embroidery on front, embellished with cutdana motifs and chiffon dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374574/67_tuoz55.jpg' },
  { name: 'Embellished', color: 'Off White Stones', price: 6000, pieces: '3 pc', collection: 'embellished', description: '3-piece lawn suit with allover aar embroidery on front, embellished with cutdana motifs and chiffon dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374574/68_f26i4i.jpg' },
  { name: 'Embellished', color: 'Icey Blue', price: 6000, pieces: '3 pc', collection: 'embellished', description: '3-piece lawn suit with allover aar embroidery on front, embellished with cutdana motifs and chiffon dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374574/69_zmxia5.jpg' },
  { name: 'Embellished', color: 'Lilac with Stones', price: 6000, pieces: '3 pc', collection: 'embellished', description: '3-piece lawn suit with allover aar embroidery on front, embellished with cutdana motifs and chiffon dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374574/70_wegkqn.jpg' },
  { name: 'Embellished', color: 'Beige with Stones', price: 1000, pieces: '3 pc', collection: 'embellished', description: '3-piece lawn suit with allover aar embroidery on front, embellished with cutdana motifs and chiffon dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374574/71_h8egfm.jpg' },

  // Ajrak Collection
  { name: 'Ajrak', color: 'Blue', price: 3200, pieces: '2 pc', collection: 'ajrak', description: '2-piece paper lawn outfit with intricate tarkashi gala and simple embroidery featuring mirror work and motifs on dupatta and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374574/72_td5jmn.jpg' },
  { name: 'Ajrak', color: 'Red', price: 3200, pieces: '2 pc', collection: 'ajrak', description: '2-piece paper lawn outfit with intricate tarkashi gala and simple embroidery featuring mirror work and motifs on dupatta and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374574/73_nyltjz.jpg' },

  // Linen Ribbon Collection
  { name: 'Linen Ribbon', color: 'Navy Blue & Off White', price: 5500, pieces: '3 pc', collection: 'linen-ribbon', description: '3-piece paper lawn outfit with intricate tarkashi gala and simple embroidery featuring mirror work and motifs on dupatta and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374575/77_bllhnq.jpg' },
  { name: 'Linen Ribbon', color: 'Black & Baby Pink', price: 5500, pieces: '3 pc', collection: 'linen-ribbon', description: '3-piece paper lawn outfit with intricate tarkashi gala and simple embroidery featuring mirror work and motifs on dupatta and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374575/78_yijelh.jpg' },
  { name: 'Linen Ribbon', color: 'Maroon & Multi', price: 5500, pieces: '3 pc', collection: 'linen-ribbon', description: '3-piece paper lawn outfit with intricate tarkashi gala and simple embroidery featuring mirror work and motifs on dupatta and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374575/79_u5hxjk.jpg' },

  // Linen Floor Length Collection
  { name: 'Linen Floor Length', color: 'Black & White Sindhi', price: 5200, pieces: '3 pc', collection: 'linen-floor-length', description: '3-piece lawn suit with allover aar embroidery on front, embellished with cutdana motifs and chiffon dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374575/81_xdxnfa.jpg' },
  { name: 'Linen Floor Length', color: 'Coffee & White', price: 5600, pieces: '3 pc', collection: 'linen-floor-length', description: '3-piece lawn suit with allover aar embroidery on front, embellished with cutdana motifs and chiffon dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374575/82_gslq79.jpg' },
  { name: 'Linen Floor Length', color: 'Olive Green on Navy', price: 5600, pieces: '3 pc', collection: 'linen-floor-length', description: '3-piece lawn suit with allover aar embroidery on front, embellished with cutdana motifs and chiffon dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374575/83_ti6ry6.jpg' },
  { name: 'Linen Floor Length', color: 'Lilac & Purple', price: 5600, pieces: '3 pc', collection: 'linen-floor-length', description: '3-piece lawn suit with allover aar embroidery on front, embellished with cutdana motifs and chiffon dupatta.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374576/86_s7pojo.jpg' },

  // Paper Lawn & Cotton Net Collection
  { name: 'Paper Lawn & Cotton Net', color: 'White on White', price: 5250, pieces: '2 pc', collection: 'paper-lawn-cotton-net', description: '2-piece paper lawn outfit with intricate tarkashi gala and simple embroidery featuring mirror work and motifs on dupatta and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374576/90_wysvmx.jpg' },
  { name: 'Paper Lawn & Cotton Net', color: 'Icey Blue ', price: 5500, pieces: '2 pc', collection: 'paper-lawn-cotton-net', description: '2-piece paper lawn outfit with intricate tarkashi gala and simple embroidery featuring mirror work and motifs on dupatta and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374576/91_o0oxaw.jpg' },
  { name: 'Paper Lawn & Cotton Net', color: 'Apple Green', price: 4500, pieces: '2 pc', collection: 'paper-lawn-cotton-net', description: '2-piece paper lawn outfit with intricate tarkashi gala and simple embroidery featuring mirror work and motifs on dupatta and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374576/92_k26cnr.jpg' },
  { name: 'Paper Lawn & Cotton Net', color: 'Red and White', price: 5250, pieces: '2 pc', collection: 'paper-lawn-cotton-net', description: '2-piece paper lawn outfit with intricate tarkashi gala and simple embroidery featuring mirror work and motifs on dupatta and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374576/93_lpembt.jpg' },
  { name: 'Paper Lawn & Cotton Net', color: 'Multi Colour', price: 4300, pieces: '1 pc', collection: 'paper-lawn-cotton-net', description: 'Single paper lawn shirt with intricate tarkashi gala and mirror work embroidery.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374576/94_igbcok.jpg' },
  { name: 'Paper Lawn & Cotton Net', color: 'Pink and White', price: 5000, pieces: '2 pc', collection: 'paper-lawn-cotton-net', description: '2-piece paper lawn outfit with intricate tarkashi gala and simple embroidery featuring mirror work and motifs on dupatta and sleeves.', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374576/96_hzroxn.jpg' },

  // Gota Collection
  { name: 'Gota', color: 'White on Pink', price: 4800, pieces: '2 pc', collection: 'gota', description: '2 PC PAPER LAWN WITH INTRICATE TARKASHI GALA. SIMPLE EMBROIDERY WITH MIRROR WORK AND MOTIFS ON DUPATTA AND SLEEVES', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374576/97_k67oe4.jpg' },
  { name: 'Gota', color: 'Gold on White', price: 4800, pieces: '2 pc', collection: 'gota', description: '2 PC PAPER LAWN WITH INTRICATE TARKASHI GALA. SIMPLE EMBROIDERY WITH MIRROR WORK AND MOTIFS ON DUPATTA AND SLEEVES', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374577/98_kyh5x3.jpg' },
  { name: 'Gota', color: 'Golden Tissue Zari', price: 6500, pieces: '2 pc', collection: 'gota', description: '2 PC PAPER LAWN WITH INTRICATE TARKASHI GALA. SIMPLE EMBROIDERY WITH MIRROR WORK AND MOTIFS ON DUPATTA AND SLEEVES', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374577/99_mezr20.jpg' },

  // Dupatta Collection
  { name: 'Dupatta', color: 'Pink & Blue', price: 4200, pieces: '1 pc', collection: 'dupatta', description: 'CHAADARS WITH TARKASHI AND DIFFERENT EMBROIDERY TECHNIQUES', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374577/100_xsmxir.jpg' },
  { name: 'Dupatta', color: 'Black & Multi', price: 4200, pieces: '1 pc', collection: 'dupatta', description: 'CHAADARS WITH TARKASHI AND DIFFERENT EMBROIDERY TECHNIQUES', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374577/101_yiesrk.jpg' },
  { name: 'Dupatta', color: 'Black and White', price: 2800, pieces: '1 pc', collection: 'dupatta', description: 'CHAADARS WITH TARKASHI AND DIFFERENT EMBROIDERY TECHNIQUES', image: 'https://res.cloudinary.com/dm7nsralr/image/upload/v1761374577/104_oxc7mu.jpg' }
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.collection.deleteMany();

    // Create collections
    console.log('Creating collections...');
    const createdCollections = {};
    for (const collection of collections) {
      const created = await prisma.collection.create({
        data: collection
      });
      createdCollections[collection.slug] = created;
      console.log(`✓ Created collection: ${collection.name}`);
    }

    // Create products
    console.log('\nCreating products...');
    let productCount = 0;
    for (const product of products) {
      const slug = `${product.name}-${product.color}`.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      await prisma.product.create({
        data: {
          name: product.name,
          slug,
          color: product.color,
          price: product.price,
          pieces: product.pieces,
          collectionId: createdCollections[product.collection].id,
          quantity: 1,
          description: product.description,
          images: product.image ? [product.image] : []
        }
      });
      productCount++;
    }

    console.log(`\n✓ Created ${productCount} products`);
    console.log('\n✨ Database seeded successfully!');
    console.log('\nSummary:');
    console.log(`- Collections: ${collections.length}`);
    console.log(`- Products: ${productCount}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();