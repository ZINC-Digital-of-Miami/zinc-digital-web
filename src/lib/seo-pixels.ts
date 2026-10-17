export const snippetProfiles={
  desktop:{label:'Desktop',titleWidth:580,descriptionWidth:600,descriptionLines:2},
  mobile:{label:'Mobile',titleWidth:340,descriptionWidth:340,descriptionLines:3},
} as const;
export type SnippetProfile={label:string;titleWidth:number;descriptionWidth:number;descriptionLines:number};
export function measureSnippet(title:string,description:string,profile:SnippetProfile,titleMeasure:(text:string)=>number,descriptionMeasure:(text:string)=>number){
  const titleText=title+' | ZINC';
  let lines=description.trim()?1:0,line='',longest=0;
  for(const word of description.trim().split(/\s+/).filter(Boolean)){
    const next=line?line+' '+word:word;
    if(line&&descriptionMeasure(next)>profile.descriptionWidth){longest=Math.max(longest,descriptionMeasure(line));lines++;line=word;}else line=next;
  }
  longest=Math.max(longest,descriptionMeasure(line));
  const titlePixels=titleMeasure(titleText);
  return {titleText,titlePixels,titleOverflow:titlePixels>profile.titleWidth,descriptionLines:lines,descriptionPixels:longest,descriptionOverflow:lines>profile.descriptionLines||longest>profile.descriptionWidth};
}
