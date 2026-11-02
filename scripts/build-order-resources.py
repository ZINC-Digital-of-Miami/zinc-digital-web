"""Build deterministic instructional SVG, fillable PDF and Excel calculator.
Local authoring tool: Python, reportlab and openpyxl. No site build dependency.
All supplied example amounts are illustrative USD, not client results.
"""
from pathlib import Path
from html import escape
import textwrap
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.workbook.properties import CalcProperties
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'public/downloads'; ART=ROOT/'public/media/order-economics'
OUT.mkdir(parents=True,exist_ok=True); ART.mkdir(parents=True,exist_ok=True)
INK='#111416'; TEAL='#067878'; GREY='#525d64'; LIGHT='#eef4f3'; LINE='#cbd4d6'
URL='https://www.zincdigital.co/blog/what-can-you-afford-to-spend-on-an-order/'
pdfmetrics.registerFont(TTFont('Avenir','/System/Library/Fonts/Avenir Next.ttc',subfontIndex=7))
pdfmetrics.registerFont(TTFont('AvenirBold','/System/Library/Fonts/Avenir Next.ttc',subfontIndex=0))
rows=[('Revenue you keep','$86','After discounts/refunds; includes net shipping'),('Order costs','−$50','Product, delivery, packing, fees and returns'),('Before acquisition','$36','Contribution, not net profit'),('Other acquisition','−$6','Creative and agency allocation'),('Keep for the business','−$12','Chosen allowance for overhead and profit'),('Available for media','$18','A ceiling to test below, not a spending order')]
parts=['<svg xmlns="http://www.w3.org/2000/svg" width="560" height="930" viewBox="0 0 560 930" role="img" aria-labelledby="title desc"><title id="title">From an $86 order to an $18 media ceiling</title><desc id="desc">Illustrative USD per original first order. 86 dollars retained revenue minus 50 dollars order costs equals 36 dollars contribution. Subtract 6 dollars other acquisition cost and 12 dollars retained for overhead and profit to leave an 18 dollar media ceiling.</desc><rect width="560" height="930" fill="#f5f7f6"/><rect width="560" height="7" fill="#067878"/>']
def st(x,y,t,size=22,color=INK,bold=False): parts.append(f'<text x="{x}" y="{y}" font-family="Avenir Next, Avenir, sans-serif" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}">{escape(t)}</text>')
st(28,49,'WHAT CAN THE ORDER FUND?',22,TEAL,True);st(28,83,'Illustrative USD · per original first order',19,GREY)
for i,(label,value,note) in enumerate(rows):
 y=110+i*119; emphasis=i in [2,5]; fill=INK if i==5 else ('#e0eeeb' if i==2 else 'white'); color='white' if i==5 else INK
 parts.append(f'<rect x="24" y="{y}" width="512" height="103" rx="5" fill="{fill}"/>')
 st(42,y+34,label,21,color,True);st(510,y+40,value,27,color,True)
 # right aligned monetary amount
 parts[-1]=parts[-1].replace('x="510"','x="510" text-anchor="end"')
 for j,line in enumerate(textwrap.wrap(note,48)): st(42,y+66+j*23,line,18,'#e0eeeb' if i==5 else GREY)
st(28,866,'Same orders. Same revenue basis. No double counting.',18,GREY);st(28,900,'The $12 allowance is a choice, not a benchmark.',18,GREY)
(ART/'spending-bridge.svg').write_text(''.join(parts)+'</svg>')

W,H=A4
c=canvas.Canvas(str(OUT/'order-acquisition-worksheet.pdf'),pagesize=A4)
c.setTitle('Order economics: illustrated worksheet and 12-point sign-off'); c.setAuthor('Jaymie Wilhoit | ZINC Digital')
def text(x,y,s,size=11,bold=False,color=INK):
 c.setFont('AvenirBold' if bold else 'Avenir',size);c.setFillColor(HexColor(color));c.drawString(x,y,s)
def para(s,x,y,width=90,size=10.5):
 for line in textwrap.wrap(s,width): text(x,y,line,size);y-=16
 return y

def page(n,title,sub):
 c.setFillColor(HexColor(TEAL));c.rect(0,H-8,W,8,fill=1,stroke=0)
 text(36,H-45,'ZINC / ORDER ECONOMICS',10,True,TEAL);text(36,H-83,title,25,True)
 para(sub,36,H-110,85,10.5)
 text(36,29,f'{n} / 4   ·   Jaymie Wilhoit / Managing Partner',9,color=GREY)
 text(36,15,'zincdigital.co/blog/what-can-you-afford-to-spend-on-an-order/',8,color=GREY)
 c.linkURL(URL,(36,11,W-36,25),relative=0)
def field(name,x,y,w=240,h=21,value=''):
 c.acroForm.textfield(name=name,tooltip=name.replace('_',' '),x=x,y=y,width=w,height=h,value=value,fontName='Helvetica',fontSize=10,borderWidth=.5,borderColor=HexColor(LINE),fillColor=white,textColor=HexColor(INK),forceBorder=True)
page(1,'A sale is not a spending limit.','Illustrative USD example: 100 paid first orders from 100 distinct new customers. Not client results. Keep refunded orders in the original group.')
y=H-170
for label,value,note in rows:
 c.setFillColor(HexColor(LIGHT));c.roundRect(36,y-68,W-72,70,4,fill=1,stroke=0)
 text(50,y-22,label,15,True);text(W-110,y-22,value,20,True,TEAL);para(note,50,y-45,76,10)
 y-=84
para('Revenue: $100 product price − $10 discounts − $8 product reversals + $4 net shipping = $86. Order costs: $32 product + $8 delivery + $4 fulfilment + $3 fees + $3 return handling = $50.',36,169,90)
para('The $12 allowance is chosen for this example. Media $1,800 + other acquisition $600 = $2,400 total CAC spend. $8,600 retained revenue − $5,000 costs − $2,400 acquisition = $1,200 before overhead and profit.',36,111,90)
c.showPage()
page(2,'Build your first-order brief.','Fill this PDF or print it. It does not calculate; use the accompanying Excel calculator for arithmetic. Choose one currency and one original order group.')
labels=['Order dates / timezone','Currency / business / owner','Original first orders / distinct new customers','Refund maturity date / estimate basis','Product price per original first order','Discounts / product refunds per order','Net shipping income per order','Product cost after supported recovery','Delivery / packing and fulfilment','Retained payment fees / return handling','Other acquisition allocation per order','Allowance for overhead and profit','Media spend / review date']
y=H-165
for i,label in enumerate(labels):
 text(36,y,label,10.5,True);field(f'input_{i+1}',36,y-29,W-72);y-=45
para('Extra costs or exclusions: include applicable chargeback losses/fees once. If a cost is missing, keep it visible and investigate before setting the budget.',36,69,91,9)
c.showPage()
# Parse the actual retained article checklist, keeping downloadable checks in sync.
article=(ROOT/'docs/editorial/articles/what-can-you-afford-to-spend-on-an-order.md').read_text()
import re
checks=re.findall(r'^\d+\. \*\*(.+?)\*\* (.+)$',article,re.M)
assert len(checks)==12
for pn,items in [(3,checks[:6]),(4,checks[6:])]:
 page(pn,'Sign off the spending limit.','Mark pass, fix or N/A. Explain each fix or N/A, attach the source and assign an owner. Hold the budget increase if the numbers do not reconcile.')
 y=H-165
 for j,(label,body) in enumerate(items):
  ix=(pn-3)*6+j+1
  text(36,y,f'{ix:02d}  {label}',12,True,TEAL)
  y=para(body,36,y-19,99,9.5)-8
  for k,status in enumerate(['Pass','Fix','N/A']):
   x=36+k*86;c.acroForm.checkbox(name=f'check_{ix}_{status}',tooltip=f'{label} {status}',x=x,y=y-1,size=12,borderWidth=.5,borderColor=HexColor(GREY),fillColor=white,buttonStyle='check');text(x+18,y,status,9)
  field(f'evidence_owner_{ix}',300,y-5,W-336,20);y-=34
 text(36,96,'Decision / reviewer / next check',10,True);field(f'review_{pn}',36,59,W-72,26)
 c.showPage()
c.save()

wb=Workbook();ws=wb.active;ws.title='First order'; notes=wb.create_sheet('Read first');sc=wb.create_sheet('Downside test')
wb.calculation=CalcProperties(calcId=191029,fullCalcOnLoad=True)
ws.append(['ORDER ECONOMICS / ILLUSTRATIVE USD','Value']);ws.append(['Edit teal input cells; formulas calculate on opening in Excel.']);ws.append(['All amounts per original first order unless labelled TOTAL.'])
inputs={5:('Original first orders',100),6:('Distinct new customers',100),7:('Product price before discounts',100),8:('Discounts',10),9:('Product refunds / revenue reversals',8),10:('Net shipping income',4),11:('Product cost net of verified recovery',32),12:('Outbound delivery',8),13:('Packaging / picking / fulfilment',4),14:('Retained payment / transaction fees',3),15:('Return handling + other order losses not counted above',3),16:('Other acquisition costs per original first order',6),17:('Retain for overhead and profit per original first order',12),18:('TOTAL media spend for this original group',1800)}
for r,(label,value) in inputs.items():ws.cell(r,1,label);ws.cell(r,2,value);ws.cell(r,2).fill=PatternFill('solid',fgColor='E0EEEB')
outputs={21:('Retained revenue','=B7-B8-B9+B10'),22:('Order costs','=SUM(B11:B15)'),23:('Contribution before acquisition','=B21-B22'),24:('Total acquisition ceiling per first order','=B23-B17'),25:('MEDIA ceiling per original first order','=B24-B16'),26:('TOTAL available media budget (zero if ceiling negative)','=IF(B25>0,B25*B5,0)'),27:('Actual media cost per original first order','=IF(B5>0,B18/B5,0)'),28:('Actual fully loaded CAC per new customer','=IF(B6>0,(B18+B16*B5)/B6,0)'),29:('Retained-revenue ROAS needed at positive media ceiling','=IF(AND(B25>0,B21>0),B21/B25,0)'),30:('TOTAL contribution after acquisition, before overhead/profit','=B21*B5-B22*B5-B16*B5-B18'),31:('TOTAL headroom after chosen allowance','=B30-B17*B5'),32:('Input / ceiling check','=IF(OR(B5<=0,B6<=0,B6<>B5,MIN(B7:B18)<0),"CHECK INPUTS",IF(B25<=0,"NO POSITIVE MEDIA BUDGET",IF(B31<0,"ABOVE CEILING","WITHIN CHOSEN CEILING")))')}
for r,(label,formula) in outputs.items():ws.cell(r,1,label);ws.cell(r,2,formula)
for r in [5,6]:ws.cell(r,2).number_format='0'
for r in list(range(7,19))+list(range(21,29))+[30,31]:ws.cell(r,2).number_format='"$"#,##0.00;[Red]("$"#,##0.00)'
ws['B29'].number_format='0.00"×"'
ws['A34']='Zero ratio/CAC outputs mean undefined when their denominator is zero; check row 32.'
ws['A35']='Defaults assume 100 first orders / 100 new customers; allocation must be documented.'
sc.append(['DOWNSIDE TEST / ILLUSTRATIVE USD']);sc.append(['Change','Extra discount','Extra refund','Extra return cost','Extra delivery','Media ceiling'])
for r,row in enumerate([['Baseline',0,0,0,0],['Another $5 discount',5,0,0,0],['More refunds + handling',0,4,1,0],['Discount + delivery',5,0,0,2]],3):
 sc.append(row+[f"='First order'!B25-SUM(B{r}:E{r})"])
sc['A9']='Additions are per original first order. Other inputs held constant; not a forecast.'
notes_rows=[['READ FIRST / ZINC DIGITAL'],['Purpose','First-order spending limit; not accounting profit or a lifetime-value model.'],['Example','All defaults are invented USD examples, not ZINC or client results.'],['Use','1. Copy the file. Choose one original order group, currency and timezone.'],['Use','2. Replace every teal input with actual per-original-order figures; media is TOTAL spend.'],['Use','3. Use net shipping income and costs after documented recovery. Do not double count.'],['Use','4. Allocate creative/agency acquisition costs once. Agree the overhead/profit allowance.'],['Use','5. Review the media ceiling, headroom and downside test before increasing spend.'],['Scope','Keep fully refunded original orders in the denominator; match late adjustments to orders.'],['Missing data','Do not leave a real cost as zero because the source is missing. Stop and investigate.'],['Inputs','Use nonnegative amounts. First-order-only group: original first orders must equal distinct new customers.'],['Extra costs','Include applicable losses/fees not already counted in row 15; document the detail.'],['CAC','Uses media plus other acquisition allocated to this group / distinct new customers.'],['ROAS','Uses retained revenue / media ceiling. Do not copy to an account on another value basis.'],['Overhead','The allowance must cover your business needs; it is not automatically sufficient.'],['Validation','Defaults: $86 revenue; $50 costs; $36 contribution; $18 media; $24 CAC; $1,200 retained.'],['Validation','Downside defaults: $18, $13, $13, $11. No positive ceiling means no funded media budget.'],['Allocation','Media can support repeat orders too. Document allocation; do not claim causal channel CAC.'],['Recheck','After normal returns and processing lag; weekly while testing; after offer/cost changes.'],['Article',URL],['Sales definitions','https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/sales-report'],['Profit costs','https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/profit-reports']]
for row in notes_rows:notes.append(row)
for sh in wb:
 sh.sheet_view.showGridLines=False;sh.freeze_panes='B5' if sh==ws else 'A3'
 sh.column_dimensions['A'].width=77;sh.column_dimensions['B'].width=33 if sh==ws else (100 if sh==notes else 18)
 for row in sh:
  for cell in row:
   cell.font=Font(name='Aptos',size=11,color='111416');cell.alignment=Alignment(vertical='top',wrap_text=True)
  sh.row_dimensions[row[0].row].height=32
 for cell in sh[1]:cell.fill=PatternFill('solid',fgColor='111416');cell.font=Font(name='Aptos',size=13,bold=True,color='FFFFFF')
 sh.print_options.horizontalCentered=True;sh.sheet_properties.pageSetUpPr.fitToPage=True;sh.page_setup.orientation='landscape';sh.page_setup.paperSize=sh.PAPERSIZE_A4;sh.page_setup.fitToWidth=1;sh.page_setup.fitToHeight=1
for col in ['C','D','E','F']:sc.column_dimensions[col].width=20
sc.column_dimensions['A'].width=32
wb.save(OUT/'order-acquisition-calculator.xlsx')
print('Created SVG (560x930), four-page fillable PDF and formula-based Excel calculator.')
