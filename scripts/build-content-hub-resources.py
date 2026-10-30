"""Regenerate the article's deterministic SVG references and fillable PDF resources.
Run with Python + reportlab. Uses Avenir Next on macOS; no network or site build hook.
"""
from pathlib import Path
from html import escape
import textwrap
from reportlab.pdfgen import canvas
from reportlab.lib.colors import toColor as HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public/downloads'
ART = ROOT / 'public/media/content-hub'
OUT.mkdir(parents=True, exist_ok=True)
ART.mkdir(parents=True, exist_ok=True)
pdfmetrics.registerFont(TTFont('Avenir', '/System/Library/Fonts/Avenir Next.ttc', subfontIndex=7))
INK, TEAL, GREY, LINE, PINK = '#111416', '#067878', '#525d64', '#cbd4d6', '#e52283'
pdfmetrics.registerFont(TTFont('AvenirBold', '/System/Library/Fonts/Avenir Next.ttc', subfontIndex=0))
URL = 'https://www.zincdigital.co/blog/build-a-content-hub-people-can-use/'

class Diagram:
    def __init__(self, title, height, pdf=None):
        self.h, self.pdf = height, pdf
        self.parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="560" height="{height}" viewBox="0 0 560 {height}" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">Planning example for an imaginary residential cleaning business. All page roles and connections are also explained in the accompanying article.</desc><rect width="560" height="{height}" fill="#f5f7f6"/>']
        self.rect(0,0,560,7,TEAL)
    def rect(self,x,y,w,h,fill='white',stroke=None):
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="{fill}" stroke="{stroke or fill}"/>')
        if self.pdf:
            c=self.pdf;c.setFillColor(HexColor(fill));c.setStrokeColor(HexColor(stroke or fill));c.roundRect(x,self.h-y-h,w,h,4,fill=1,stroke=1)
    def text(self,x,y,s,size=24,color=INK):
        self.parts.append(f'<text x="{x}" y="{y}" font-family="Avenir Next, Avenir, sans-serif" font-size="{size}" fill="{color}">{escape(s)}</text>')
        if self.pdf:
            self.pdf.setFont('AvenirBold' if size>=24 else 'Avenir',size);self.pdf.setFillColor(HexColor(color));self.pdf.drawString(x,self.h-y,s)
    def line(self,x1,y1,x2,y2,color=TEAL,dash=False):
        self.parts.append(f'<path d="M{x1} {y1}L{x2} {y2}" fill="none" stroke="{color}" stroke-width="3"'+(' stroke-dasharray="7 5"' if dash else '')+'/>')
        if self.pdf:
            c=self.pdf;c.setStrokeColor(HexColor(color));c.setLineWidth(3);c.setDash([7,5] if dash else []);c.line(x1,self.h-y1,x2,self.h-y2);c.setDash([])
    def save(self,name): (ART/name).write_text(''.join(self.parts)+'</svg>')

def architecture(pdf=None):
    d=Diagram('A pillar with distinct supporting answers',1010,pdf)
    d.text(32,50,'ONE SUBJECT. CLEAR PAGE ROLES.',22,TEAL)
    d.rect(32,78,496,90,INK);d.text(52,114,'Business goal',23,'white');d.text(52,146,'Suitable regular-cleaning enquiries',22,'white')
    d.line(280,168,280,201)
    d.rect(32,202,496,125,'white',TEAL);d.text(52,240,'PILLAR CATEGORY',22,TEAL);d.text(52,276,'Regular home cleaning',25);d.text(52,308,'Aligned with the primary service',21,GREY)
    d.line(49,327,49,770)
    for i,(title,detail) in enumerate([('Choosing guide','How to select the right service'),('Inclusions','Tasks and exclusions'),('Frequency','Weekly or fortnightly?'),('Price factors','What goes into a quote?'),('First visit','Access and preparation')]):
        y=350+i*84;d.line(49,y+37,66,y+37);d.rect(66,y,462,74,'white',LINE);d.text(84,y+31,title,25);d.text(84,y+60,detail,22,GREY)
    d.text(32,820,'The category houses these five blogs.',21,TEAL)
    d.line(280,845,280,888,PINK,True);d.rect(32,890,496,85,INK);d.text(50,926,'SEPARATE SERVICE PAGE',20,'white');d.text(50,958,'Actual offer + quote request',23,'white')
    return d

def links(pdf=None):
    d=Diagram('Useful links, without linking everything to everything',790,pdf)
    d.text(32,49,'LINK WITH A REASON.',26,TEAL)
    d.rect(32,80,496,95,INK);d.text(52,118,'PILLAR CATEGORY',22,'white');d.text(52,151,'Regular home cleaning blogs',25,'white')
    d.line(150,175,150,235);d.line(410,175,410,235)
    for x,title,sub in [(32,'Inclusions','What is covered?'),(300,'Frequency','How often?')]:
        d.rect(x,235,228,115,'white',TEAL);d.text(x+16,278,title,24);d.text(x+16,313,sub,21,GREY)
    d.line(260,292,300,292,PINK,True);d.line(268,285,260,292,PINK);d.line(268,299,260,292,PINK)
    d.text(32,390,'Frequency → inclusions:',23,INK);d.text(32,423,'check what you are comparing.',22,GREY)
    d.rect(32,463,496,90,'white',LINE);d.text(52,500,'PRICE ARTICLE',23,TEAL);d.text(52,533,'Explain the quote factors first.',22)
    d.line(280,553,280,605,PINK,True)
    d.rect(32,605,496,90,INK);d.text(52,642,'SERVICE / QUOTE PAGE',22,'white');d.text(52,675,'A relevant next action when ready.',22,'white')
    d.text(32,739,'Teal: category ↔ its blogs',21,TEAL);d.text(32,773,'Dashed: contextual or commercial next step',20,GREY)
    return d

architecture().save('pillar-map.svg');links().save('link-plan.svg')
W,H=A4

def page(c,n,title,sub=''):
    c.setPageSize(A4);c.setFillColor(white);c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(HexColor(TEAL));c.rect(36,H-40,W-72,4,fill=1,stroke=0)
    c.setFont('Avenir',10);c.setFillColor(HexColor(GREY));c.drawString(36,H-63,'ZINC DIGITAL  /  WENDY FUNNELL  /  CONTENT PLANNING')
    c.setFont('AvenirBold',23);c.setFillColor(HexColor(INK));c.drawString(36,H-103,title)
    if sub: para(c,sub,36,H-126,W-72,10)
    c.setFont('Avenir',8);c.setFillColor(HexColor(GREY));c.drawString(36,27,'zincdigital.co  ·  30 October 2026  ·  v1.0');c.drawRightString(W-36,27,str(n))

def para(c,s,x,y,width,size=11,leading=None):
    leading=leading or size*1.45
    words=s.split();lines=[];line=''
    for word in words:
        if pdfmetrics.stringWidth((line+' '+word).strip(),'Avenir',size)>width and line: lines.append(line);line=word
        else: line=(line+' '+word).strip()
    if line:lines.append(line)
    c.setFont('Avenir',size);c.setFillColor(HexColor(INK))
    for line in lines:c.drawString(x,y,line);y-=leading
    return y

def field(c,name,label,x,y,width,height=40):
    c.setFont('Avenir',10);c.setFillColor(HexColor(TEAL));c.drawString(x,y,label)
    c.acroForm.textfield(name=name,tooltip=label,x=x,y=y-height-9,width=width,height=height,fontSize=10,borderWidth=.7,borderColor=HexColor(LINE),fillColor=white,textColor=HexColor(INK),fieldFlags='multiline')

def draw_ref(c,fn,x,y,width):
    h=1010 if fn==architecture else 790;s=width/560
    c.saveState();c.translate(x,y-h*s);c.scale(s,s);fn(c);c.restoreState()

ref=canvas.Canvas(str(OUT/'content-hub-architecture.pdf'),pagesize=A4)
ref.setTitle('Content hub architecture and linking reference');ref.setAuthor('Wendy Funnell | ZINC Digital')
for i,(fn,title,sub) in enumerate([(architecture,'Give every page a job','Illustrative cleaning-business example. A planning model, not a ranking formula.'),(links,'Make the next link useful','The complete cluster has a guide route, relevant cross-links and a commercial destination.')],1):
    page(ref,i,title,sub);draw_ref(ref,fn,145,H-170,300)
    para(ref,'Read the article for scope, intent, page ownership and launch checks. No fixed cluster size or compulsory URL folder is implied.',36,88,W-72,10);ref.linkURL(URL,(36,42,W-36,65),relative=0);ref.showPage()
ref.save()

c=canvas.Canvas(str(OUT/'content-hub-workbook.pdf'),pagesize=A4)
c.setTitle('Content hub planning workbook');c.setAuthor('Wendy Funnell | ZINC Digital')
page(c,1,'Start with the page relationships','Worked example: an imaginary business, not a client result. Use the next pages for your own plan.')
draw_ref(c,architecture,157,H-165,280)
para(c,'Pillar: a blog category aligned with a primary service or product collection. The category houses its blogs; the service page presents the actual offer. There is no required page count or word count.',36,115,W-72,11)
para(c,'Complete fields in a PDF reader that supports forms, or print. Save your own copy. Read the full article at zincdigital.co/blog/build-a-content-hub-people-can-use/.',36,72,W-72,9);c.showPage()
page(c,2,'Define the subject before the pages','Complete the boundaries and business goal before commissioning a writer.')
for i,(name,label) in enumerate([('business','Offer and business goal'),('reader','Reader and decision they need to make'),('scope','Pillar category / aligned service or collection'),('include','Included blog subjects'),('exclude','Excluded subjects and why'),('next','Commercial destination and next action')]):field(c,name,label,36,H-175-i*95,W-72,54)
c.showPage()
page(c,3,'Map the questions to pages','One task per row. Similar wording does not automatically require separate pages.')
for i in range(4):
    y=H-170-i*143
    field(c,f'task{i}',f'{i+1}. Customer question / intent',36,y,250,42)
    field(c,f'url{i}','Preferred page / existing URL',305,y,254,42)
    field(c,f'proof{i}','Distinct answer / evidence needed',36,y-68,250,42)
    field(c,f'action{i}','Reader next step / page owner',305,y-68,254,42)
para(c,'Copy this sheet for more questions. The pillar category houses the blogs; each blog owns a reader question. Review overlap before creating another address.',36,65,W-72,9);c.showPage()
page(c,4,'Audit the pages and plan the links','Keep, update, combine or create. A combination needs a destination and a redirect check.')
for i in range(3):
    y=H-170-i*185
    field(c,f'old{i}',f'{i+1}. Existing page / purpose',36,y,250,40)
    field(c,f'decision{i}','Action / preferred destination',305,y,254,40)
    field(c,f'link{i}','Link from → to / wording / reason',36,y-67,W-72,43)
    field(c,f'owner{i}','Owner / redirect or link test / due date',36,y-137,W-72,25)
c.showPage()
page(c,5,'Sign off the complete launch','Choose one status per check: P = Pass, F = Fix, N = Not applicable. Keep evidence on page 6.')
article=(ROOT/'docs/editorial/articles/build-a-content-hub-people-can-use.md').read_text().split('## 8. Complete the launch checklist',1)[1].split('## 9.',1)[0]
items=[line[2:] for line in article.splitlines() if line.startswith('- ')]
assert len(items)==24,len(items)
for col in range(2):
    x=36+col*270;y=H-171
    c.setFont('Avenir',8);c.setFillColor(HexColor(GREY));c.drawString(x,y,'P    F    N');y-=21
    for j,s in enumerate(items[col*12:(col+1)*12]):
        n=col*12+j+1
        for k in range(3):c.acroForm.checkbox(name=f'check{n}_{k}',tooltip=f'Check {n}: '+['Pass','Fix','Not applicable'][k],x=x+k*14,y=y-9,size=9,buttonStyle='check',borderWidth=.6,borderColor=HexColor(GREY))
        end=para(c,f'{n}. '+s,x+47,y,208,8.3,11)
        y=end-15
    assert y>44,y
c.showPage()
page(c,6,'Record evidence and review the result','An unchecked item is unresolved. A download or enquiry increase alone does not prove impact.')
for i,(name,label,height) in enumerate([('issues','Unresolved checks: number / evidence / owner / due date',100),('na','Not applicable: check number and reason',60),('baseline','Page group / measures / source / baseline dates and values',70),('review','Comparable review dates / findings / changes / limitations',70),('approve','Factual reviewer / launch approval / next review and triggers',50)]):
    y=[H-170,H-305,H-400,H-505,H-610][i];field(c,name,label,36,y,W-72,height)
para(c,'Article and sources: '+URL,36,67,W-72,8);c.linkURL(URL,(36,45,W-36,75),relative=0);c.showPage();c.save()
print('Built two SVG illustrations, six-page fillable workbook and two-page reference.')
