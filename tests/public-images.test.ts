import {test} from 'node:test';
import assert from 'node:assert/strict';

test('supporting image schema covers informative public images once and preserves actual descriptions',async()=>{
 const mod=await import('../src/lib/public-images.ts');
 const html='<figure><picture><source srcset="/photo.avif"><img src="/photo.webp?dpl=old" width="1200" height="800" alt="Dock crew installing a waterfront piling"><figcaption>Dock construction crew at work.</figcaption></picture></figure><img src="/photo.webp?dpl=new" alt="Same photograph"><img src="/mark.svg" alt=""><div aria-hidden="true"><img src="/decoration.png" alt="Decorative pattern" role="presentation"></div>';
 const images=mod.publicImageEntities(html,'https://www.zincdigital.co/work/summit/');
 assert.equal(images.length,1);
 assert.equal(images[0].contentUrl,'https://www.zincdigital.co/photo.webp');
 assert.equal(images[0].description,'Dock crew installing a waterfront piling');
 assert.equal(images[0].width,1200);assert.equal(images[0].height,800);
 assert.equal(images[0].caption,'Dock construction crew at work.');
 assert.deepEqual(images[0].isPartOf,{'@id':'https://www.zincdigital.co/work/summit/#webpage'});
});

test('image metadata does not turn private or executable sources into public image URLs',async()=>{
 const mod=await import('../src/lib/public-images.ts');
 const images=mod.publicImageEntities('<img src="javascript:alert(1)" alt="Invalid"><img src="/api/admin/file" alt="Private"><img src="data:image/png;base64,private" alt="Inline"><img src="/public.svg" alt="Company logo">','https://www.zincdigital.co/');
 assert.equal(images.length,1);assert.equal(images[0].contentUrl,'https://www.zincdigital.co/public.svg');
});


test('published photographs in inactive gallery slides remain directly discoverable',async()=>{
 const {publicImageEntities}=await import('../src/lib/public-images.ts');
 const images=publicImageEntities('<div aria-hidden="true" data-slide><img src="/photo-hidden.webp" alt="Dock under construction"></div>','https://www.zincdigital.co/work/summit/');
 assert.equal(images.length,1);assert.equal(images[0].description,'Dock under construction');
});
