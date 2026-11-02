"""Build the approved blog review tools. Run manually with Python/reportlab.
Exact instructional diagrams and fillable PDFs; no network or build hook.
"""
from pathlib import Path
from html import escape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
import textwrap

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public/downloads'
ART = ROOT / 'public/media/blog-review'
OUT.mkdir(parents=True, exist_ok=True)
ART.mkdir(parents=True, exist_ok=True)
INK, TEAL, GREY = '#14191b', '#086e72', '#47575b'

def line(c, text, y, size=11, color=INK):
    c.setFillColor(HexColor(color)); c.setFont('Helvetica', size)
    for row in textwrap.wrap(text, width=87 if size == 11 else 60):
        c.drawString(40, y, row); y -= size * 1.5
    return y

def header(c, title, page):
    c.setFillColor(HexColor(TEAL)); c.rect(40, 792, 42, 4, fill=1, stroke=0)
    line(c, 'ZINC / PRACTICAL WORKSHEET', 771, 10, GREY)
    line(c, title, 738, 21)
    line(c, 'Illustrative examples. Replace them with your own verified records.', 700)
    line(c, 'zincdigital.co / '+str(page), 25, 9, GREY)

def field(c, label, name, y, height=30):
    line(c, label, y, 10, GREY)
    c.acroForm.textfield(name=name, tooltip=label, x=40, y=y-height-9,
        width=515, height=height, borderWidth=1, borderColor=HexColor('#9caaad'),
        fillColor=HexColor('#ffffff'), textColor=HexColor(INK),
        fontName='Helvetica', fontSize=10, fieldFlags='multiline' if height>32 else '')
    return y-height-33

def workbook(slug, title, example, fields, checks, article):
    c=canvas.Canvas(str(OUT/(slug+'.pdf')),pagesize=A4)
    c.setTitle(title); c.setAuthor('ZINC Digital'); c.setSubject('Business-owner review worksheet with illustrative example and fillable checks')
    header(c,title,1);y=655
    for heading,body in example:
        y=line(c,heading,y,14,TEAL)-8;y=line(c,body,y)-22
    y=line(c,'Read the complete instructions',y,14,TEAL)-8
    y=line(c,article,y,10)
    c.linkURL(article,(40,y,555,y+32),relative=0)
    c.showPage();header(c,title+' / your record',2);y=655
    for n,(label,height) in enumerate(fields): y=field(c,label,slug+'-field-'+str(n),y,height)
    c.showPage();header(c,title+' / acceptance checks',3);y=650
    line(c,'Check only after verification. Record exceptions below; an empty box is unresolved.',y);y-=40
    for n,label in enumerate(checks):
        c.acroForm.checkbox(name=slug+'-check-'+str(n),tooltip=label,x=40,y=y-3,size=13,
            buttonStyle='check',borderWidth=1,borderColor=HexColor(TEAL),fillColor=HexColor('#ffffff'))
        c.setFont('Helvetica',10);c.setFillColor(HexColor(INK))
        for row in textwrap.wrap(label,83):c.drawString(62,y,row);y-=15
        y-=13
    field(c,'Exceptions, owner and next review date',slug+'-exceptions',y-8,70)
    c.save()

workbook('search-review-workbook','Search review workbook',[
 ('Example: appearances are not customers','A page received 10,000 impressions and 400 clicks in the earlier period, then 12,000 impressions and 360 clicks. CTR changed from 4% to 3%. These sample figures do not prove that its title failed or that sales fell.'),
 ('Next check','Compare query, device and country mix using identical filters. Check the actual page and inquiry records. Keep observed changes separate from possible explanations.'),
 ('Canonical example','A tracking-parameter URL may duplicate a clean product URL. A collection and an individual product are different pages. Inspect equivalence before choosing a canonical or redirect.'),
 ('AI visibility','Record the product, exact prompt, date, location context, cited URLs and accuracy. Report native AI visibility metrics under their own definitions. A sampled citation is not a ranking guarantee or a qualified lead.')
], [('Business question and target URL',46),('Property, report, filters and complete comparison periods',46),('Observed figures and their definitions',46),('Source URLs / indexed versus live evidence',46),('Possible explanations and the next distinguishing check',46),('Proposed action, owner and follow-up date',46)], [
 'The correct property and page are identified.', 'Periods and filters are recorded and comparable.',
 'Recent incomplete data and seasonality are noted.', 'Query privacy and export limits are acknowledged.',
 'The actual page and intended customer journey were inspected.', 'Canonical or indexing claims have URL-level evidence.',
 'Live-test results are distinguished from indexed information.', 'AI observations include platform, prompt, date and limitations.',
 'Impressions, visits and qualified inquiries are kept separate.', 'The proposed repair follows the evidence.',
 'The changed page will be checked after release.', 'An owner and follow-up date are assigned.'
], 'https://www.zincdigital.co/blog/google-search-console-the-operators-guide/')

workbook('campaign-test-brief','Campaign test brief',[
 ('Example: website sales','Illustrative authorization: $400 total test spend, with a $20 media allowance per first order. At full spend, 20 first orders meet that allowance. This is a planning calculation, not a forecast.'),
 ('Example: qualified inquiries','Illustrative outcome: $300 spend, 15 valid distinct inquiries and six qualified inquiries. Cost per valid inquiry is $20; cost per qualified inquiry is $50. Neither is customer acquisition cost without confirmed customers.'),
 ('Choose the actual path','Record objective, conversion location, identity, audience, placement, budget type, dates and time zone. Verify the current platform spending rules rather than assuming a daily setting is an exact lifetime cap.'),
 ('Review the whole journey','Test the advertised offer, landing page, form or checkout and measurement. Check approval, delivery and business outcomes separately. Save the final campaign settings before interpreting results.')
], [('Business outcome, qualification definition and offer',46),('Platform, objective, conversion location and destination',46),('Audience, identity and placement choices',46),('Authorized total, budget type, schedule and time zone',46),('Event test, creative rights and mobile journey result',46),('Review owner, stop conditions and next check',46)], [
 'The business controls the relevant account and identity.', 'The objective matches the required outcome.',
 'The destination and conversion location match.', 'A controlled event test is recorded.',
 'Duplicate events and invalid submissions were checked.', 'The offer, stock and delivery or service terms are accurate.',
 'Creative and music or image rights are approved.', 'Mobile previews and the destination were inspected.',
 'Budget type, platform rules and total authorization were reconciled.', 'Dates and time zone were checked.',
 'A person owns inquiry follow-up or order review.', 'Platform attribution and source business records remain distinct.'
], 'https://www.zincdigital.co/blog/meta-ads-basics/')

def svg(title, description, body, height):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 {height}" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">{escape(description)}</desc><rect width="560" height="{height}" fill="#f6f7f5"/><style>text{{font-family:Arial,sans-serif;fill:{INK}}}.label{{font-size:25px;font-weight:700}}.note{{font-size:21px}}.rule{{stroke:#aab8b8;stroke-width:2}}</style>{body}</svg>'

rows=[('Equivalent pages, both needed','Canonical signal','Keep the preferred URL consistent.'),('Old URL permanently replaced','Relevant redirect','Test the destination and avoid loops.'),('Distinct useful pages','Keep and clarify','Products are not their collections.'),('Page should stay out of Search','Indexing decision','Protect private content with access controls.')]
body='<text x="28" y="48" class="label">Which URL should represent the page?</text>'
for n,(purpose,action,note) in enumerate(rows):
    y=80+n*185
    body+=f'<line x1="28" y1="{y}" x2="532" y2="{y}" class="rule"/><text x="28" y="{y+40}" class="label">{escape(purpose)}</text><rect x="28" y="{y+60}" width="310" height="48" fill="#086e72"/><text x="44" y="{y+92}" style="font-size:23px;fill:white">{escape(action)}</text>'
    for j,row in enumerate(textwrap.wrap(note,42)):body+=f'<text x="28" y="{y+143+j*27}" class="note">{escape(row)}</text>'
(ART/'canonical-decisions.svg').write_text(svg('Canonical and redirect decisions','Choose a canonical for equivalent accessible pages, a redirect for a replaced URL, or preserve distinct useful pages. Indexing restrictions do not protect private content.',body,850))
body='<text x="28" y="48" class="label">Five different campaign checkpoints</text>'
for n,(a,b) in enumerate([('Submitted','The platform received the campaign.'),('Approved','The campaign passed its review.'),('Delivering','Ads are actually being served.'),('Measured','Events are recorded correctly.'),('Useful','Real outcomes justify the cost.')]):
    y=85+n*125;body+=f'<text x="28" y="{y+30}" class="label">0{n+1}</text><text x="90" y="{y+30}" class="label">{a}</text><text x="90" y="{y+66}" class="note">{b}</text><line x1="28" y1="{y+96}" x2="532" y2="{y+96}" class="rule"/>'
(ART/'campaign-checkpoints.svg').write_text(svg('Five campaign checkpoints','Submission, approval, delivery, correct measurement and useful business outcomes are separate states. Verify each rather than treating approval as success.',body,740))
print('Built two three-page fillable workbooks and two instructional SVGs.')
