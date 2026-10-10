export const websiteCases = {
  'fraim-cawley-company': {
    name:'Fraim, Cawley & Company', short:'Fraim, Cawley\n& Company.', industry:'Accounting', eyebrow:'CPA firm / Website', headline:'A clear view of\nthe firm.',
    intro:'A website for Fraim, Cawley & Company, connecting the firm’s accounting and tax services with a clear professional presence.',
    description:'A restrained blue palette, generous white space and direct navigation bring the firm’s services into focus. The presentation carries that structure across desktop, tablet and mobile.',
    image:'tax.jpeg', accent:'#7aa5ca', next:'smoky-mountain-survival',
    details:[['Professional presence','The firm’s name and services lead the experience, supported by a calm blue-and-white visual language.'],['Clear navigation','Tax and business services sit alongside information about the firm, its articles and ways to get in touch.'],['Across screens','The website presentation shows how the same content hierarchy moves from a wide desktop layout to a compact mobile view.']],
  },
  'smoky-mountain-survival': {
    name:'Smoky Mountain Survival', short:'Smoky Mountain\nSurvival.', industry:'Outdoor', eyebrow:'Outdoor / Website', headline:'Built around\nthe outdoors.',
    intro:'A website for Smoky Mountain Survival, with an outdoor visual direction and a direct path into the business.',
    description:'Landscape and equipment imagery set the scene. Strong headings and warm accents give the website a recognizable character, with navigation organized around the company, classes, gear and contact.',
    image:'smoky-white-devices.png', accent:'#d9a563', next:'andrew-neese',
    details:[['The setting leads','Outdoor imagery gives the opening view its character and immediately establishes the subject of the website.'],['Practical structure','Company information, classes, gear and contact each have a clear place in the navigation.'],['Consistent presentation','The desktop and mobile compositions carry the same outdoor imagery, dark typography and warm accent color.']],
  },
  'andrew-neese': {
    name:'Andrew Neese', short:'Andrew\nNeese.', industry:'Real estate', eyebrow:'Real estate / Website', headline:'A personal\nplace to begin.',
    intro:'A real estate website for Andrew Neese, bringing a personal name and property imagery into one focused presentation.',
    description:'A large residential image establishes the setting. The name, navigation and primary message remain distinct, with restrained gold tones supporting the photography.',
    image:'andrew-white-devices.png', accent:'#c7b77f', next:'porsche-roanoke',
    details:[['A personal introduction','The name is prominent in the header, giving the website an individual point of view.'],['Property in focus','Residential photography carries the opening view while the headline and navigation remain easy to distinguish.'],['A connected presentation','Desktop, laptop, tablet and phone views share the same visual direction and content hierarchy.']],
  },
  'porsche-roanoke': {
    name:'Porsche / Roanoke', short:'Porsche.\nRoanoke.', industry:'Automotive', eyebrow:'Roanoke, Virginia / Two websites', headline:'The dealership.\nThe merchandise.',
    intro:'Website work for the Porsche dealership in Roanoke, Virginia: the dealer website and a separate website for official Porsche merchandise.',
    description:'The engagement covered two distinct destinations. One represented the local dealership; the other presented its official Porsche merchandise offering.',
    image:'porsche-white-devices.png', accent:'#d2bcb0', next:'las-vegas-safety',
    details:[['Dealer website','The website for the Porsche dealership in Roanoke, Virginia.'],['Official merchandise website','A separate website for the dealership’s official Porsche merchandise.'],['Local project scope','This portfolio entry covers the Roanoke dealership’s two websites.']],
  },
} as const;
export type WebsiteCaseSlug = keyof typeof websiteCases;
