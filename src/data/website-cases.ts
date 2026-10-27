export const websiteCases = {
  'fraim-cawley-company': {
    name:'Fraim, Cawley & Company', short:'Fraim, Cawley\n& Company.', industry:'Accounting', eyebrow:'CPA firm / Website', headline:'A clear view of\nthe firm.',
    intro:'A website for Fraim, Cawley & Company, connecting the firm’s accounting and tax services with a clear professional presence.',
    description:'For an accounting firm, the website has to introduce both the practice and the services a client may need. The design puts tax and business services alongside information about the firm, articles and contact. Blue, white space and a restrained hierarchy support that professional reading without making every part of the page compete for attention.',
    image:'tax.jpeg', accent:'#7aa5ca', next:'smoky-mountain-survival',
    details:[['Professional presence','The firm’s name and services lead the experience, supported by a calm blue-and-white visual language.'],['Clear navigation','Tax and business services sit alongside information about the firm, its articles and ways to get in touch.'],['Across screens','The website presentation shows how the same content hierarchy moves from a wide desktop layout to a compact mobile view.']],
  },
  'smoky-mountain-survival': {
    name:'Smoky Mountain Survival', short:'Smoky Mountain\nSurvival.', industry:'Outdoor', eyebrow:'Outdoor / Website', headline:'Built around\nthe outdoors.',
    intro:'A website for Smoky Mountain Survival, with an outdoor visual direction and a direct path into the business.',
    description:'The site brings the company, classes, gear and contact into one outdoor-focused experience. Landscape and equipment photography establish the setting; strong headings and warm accents organize the information around it. The result is a website presentation that gives visitors both a sense of the business and distinct paths to explore what it offers.',
    image:'smoky-white-devices.png', accent:'#d9a563', next:'andrew-neese',
    details:[['The setting leads','Outdoor imagery gives the opening view its character and immediately establishes the subject of the website.'],['Practical structure','Company information, classes, gear and contact each have a clear place in the navigation.'],['Consistent presentation','The desktop and mobile compositions carry the same outdoor imagery, dark typography and warm accent color.']],
  },
  'andrew-neese': {
    name:'Andrew Neese', short:'Andrew\nNeese.', industry:'Real estate', eyebrow:'Real estate / Website', headline:'A personal\nplace to begin.',
    intro:'A real estate website for Andrew Neese, bringing a personal name and property imagery into one focused presentation.',
    description:'Real estate is a visual category, but this website also needed to give Andrew Neese a distinct personal presence. The opening composition pairs residential photography with his name and a clear message. Restrained gold tones and straightforward navigation keep the agent’s identity connected to the properties, rather than letting the photography become an anonymous backdrop.',
    image:'andrew-white-devices.png', accent:'#c7b77f', next:'porsche-roanoke',
    details:[['A personal introduction','The name is prominent in the header, giving the website an individual point of view.'],['Property in focus','Residential photography carries the opening view while the headline and navigation remain easy to distinguish.'],['A connected presentation','Desktop, laptop, tablet and phone views share the same visual direction and content hierarchy.']],
  },
  'porsche-roanoke': {
    name:'Porsche / Roanoke', short:'Porsche.\nRoanoke.', industry:'Automotive', eyebrow:'Roanoke, Virginia / Two websites', headline:'The dealership.\nThe merchandise.',
    intro:'Website work for the Porsche dealership in Roanoke, Virginia: the dealer website and a separate website for official Porsche merchandise.',
    description:'The engagement covered two distinct customer interests under the dealership’s Porsche identity. The dealer website represented the Roanoke business. A separate official merchandise website gave the dealership’s Porsche merchandise its own destination. Separating those experiences gave each a clear purpose: exploring the dealership and exploring the merchandise offering.',
    image:'porsche-white-devices.png', accent:'#d2bcb0', next:'las-vegas-safety',
    details:[['Dealer website','The website for the Porsche dealership in Roanoke, Virginia.'],['Official merchandise website','A separate website for the dealership’s official Porsche merchandise.'],['Local project scope','This portfolio entry covers the Roanoke dealership’s two websites.']],
  },
} as const;
export type WebsiteCaseSlug = keyof typeof websiteCases;
