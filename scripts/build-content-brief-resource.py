"""Render the content-brief article's fillable worksheet and exact relationship diagram."""
from pathlib import Path
from html import escape
import textwrap
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4

root=Path(__file__).resolve().parent.parent
out=root/'public/downloads/content-brief-worksheet.pdf'
url='https://www.zincdigital.co/blog/content-briefs-search-intent-internal-links/'
c=canvas.Canvas(str(out),pagesize=A4, invariant=1)
c.setTitle('Content brief and editorial handover');c.setAuthor('ZINC Digital')
ink=HexColor('#14191b');teal=HexColor('#086e72')
def text(value,y,size=11,width=87):
 c.setFillColor(ink);c.setFont('Helvetica',size)
 for row in textwrap.wrap(value,width):c.drawString(40,y,row);y-=size*1.45
 return y

def header(title,num):
 c.setFillColor(teal);c.rect(40,792,42,4,fill=1,stroke=0)
 text('ZINC / CONTENT BRIEF',769,10);text(title,735,21,46)
 text('zincdigital.co | '+str(num)+' / 4',25,9)
 c.linkURL(url,(40,18,300,36))

def field(label,name,y,height=36):
 text(label,y,10)
 c.acroForm.textfield(name=name,tooltip=label,x=40,y=y-height-10,width=515,height=height,borderWidth=1,borderColor=HexColor('#8a999b'),fillColor=HexColor('#ffffff'),textColor=ink,fontSize=10,fontName='Helvetica',fieldFlags='multiline')
 return y-height-36

header('Worked assignment',1)
y=text('Illustrative business-intelligence article. Adapt the example to your own service or collection; it is not a client result.',683)
for label,body in [
 ('Reader and outcome','Business owner comparing dashboard providers. Finish with a requirements list covering decision, sources, definitions, access and acceptance.'),
 ('Category and article','Business intelligence is the service-aligned blog category. The dashboard preparation guide is an article inside it. The commercial service page explains the offer.'),
 ('Opening answer','Define the decision, records and measures before buying. Agree on a small example that the owner and supplier can both calculate.'),
 ('Evidence to collect','Obtain approved metric definitions and the documentation for the actual source systems. Record exact URLs or approved records and reviewer; do not imply evidence has been collected when it has not.'),
 ('Concrete link decisions','At the definitions section: /blog/business-intelligence-basics/. At the optional purchase-tracking section: /blog/ga4-ecommerce-event-validation/. At the implementation step: /services/business-intelligence/. Category navigation: /blog/category/business-intelligence/.'),
 ('Acceptance','A reader can complete the requirements list without another guide filling in missing instructions. Sources support the claims; examples are labelled; the category and incoming link work.')]:
 y-=19;y=text(label,y,13);y-=5;y=text(body,y)
c.showPage();header('Your assignment',2);y=680
for i,(label,height) in enumerate([
 ('Reader and starting knowledge',38),('One question and the finished reader outcome',40),('Service/collection category; closest existing article; update or new?',44),('Provisional answer and unresolved facts',48),('Section jobs: question, answer, demonstration or evidence',70),('Writer, reviewer, due date and update trigger',38)]):y=field(label,'assignment-'+str(i),y,height)
c.showPage();header('Evidence and link decisions',3);y=680
for i,(label,height) in enumerate([
 ('Claim 1: exact source, supporting passage, limitation, date and reviewer',62),('Claim 2: exact source, supporting passage, limitation, date and reviewer',62),('Outgoing links: placement, exact URL, anchor text and reader benefit',72),('Incoming link: existing page, paragraph, anchor and implementation owner',55),('Diagram / download: reader task, contents and validation method',55),('Exclusions and unresolved evidence: owner and next action',40)]):y=field(label,'evidence-'+str(i),y,height)
c.showPage();header('Handover and publication checks',4);y=text('Tick only after checking. An empty box remains open. Record any exception below.',680)-30
checks=[
 'The writer can describe the reader and the finished outcome.',
 'The category matches a primary service or product collection.',
 'The existing-page check supports a new article or a scoped update.',
 'Each section has a useful job; overlapping topics have boundaries.',
 'Consequential claims have exact, checked evidence and a reviewer.',
 'Illustrative examples are labelled; private or invented results are absent.',
 'A reader can complete the promised task using the article.',
 'Outgoing links resolve and help at their actual placement.',
 'A relevant existing page links into the new or updated article.',
 'The diagram is legible on mobile and explained in adjacent text.',
 'The actual download opens, can be completed and saves correctly.',
 'Title, summary and description match the finished article.',
 'The published page appears in its intended category.',
 'A maintenance owner, review date and change trigger are recorded.']
for i,label in enumerate(checks):
 c.acroForm.checkbox(name='check-'+str(i),tooltip=label,x=40,y=y-3,size=12,buttonStyle='check',borderColor=teal)
 c.setFillColor(ink);c.setFont('Helvetica',10)
 for row in textwrap.wrap(label,83):c.drawString(62,y,row);y-=15
 y-=13
field('Unresolved items, owner, due date and final sign-off','exceptions',y-8,75)
c.save()

parts=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 760" role="img" aria-labelledby="title desc"><title id="title">A category houses the article; links serve the reader</title><desc id="desc">The business intelligence service aligns with its blog category. The dashboard preparation article belongs to that category. A contextual link explains metric definitions; an optional commercial next step leads to the service.</desc><rect width="560" height="760" fill="#f6f7f5"/><style>text{font-family:Arial,sans-serif;fill:#14191b}.title{font-size:25px;font-weight:700}.label{font-size:23px}.note{font-size:21px}</style>']
for y,kicker,title,detail in [(35,'COMMERCIAL OFFER','Business intelligence service','Explains scope and how to enquire.'),(213,'PILLAR / BLOG CATEGORY','Business intelligence articles','Houses articles on the main topic.'),(391,'ARTICLE WITHIN THE CATEGORY','Prepare to buy a dashboard','Helps the owner write requirements.')]:
 parts.append(f'<text x="28" y="{y}" style="font-size:16px;fill:#086e72">{kicker}</text><text x="28" y="{y+38}" class="title">{title}</text><text x="28" y="{y+76}" class="note">{detail}</text>')
 if y<391:parts.append(f'<path d="M48 {y+96}v42m-7-7 7 7 7-7" fill="none" stroke="#086e72" stroke-width="3"/>')
parts.append('<path d="M28 510h504" stroke="#9caaad"/><text x="28" y="552" class="title">Two useful next steps</text><text x="28" y="596" class="label">Need definitions? Read the supporting guide.</text><text x="28" y="638" class="label">Need help? Review the service offer.</text><text x="28" y="699" class="note">The guide is not the category.</text></svg>')
(root/'public/media/blog-review/content-brief-map.svg').write_text(''.join(parts))
print(out)
