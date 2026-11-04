import {test} from 'node:test';
import assert from 'node:assert/strict';
import {quoteInput, dollarsToCents, squareEstimateUrl, crmTotals} from '../src/lib/crm-model.ts';

test('quote amounts preserve cents and reject exponent, rounding and unsafe totals',()=>{
 assert.equal(dollarsToCents('1500.09'),150009);
 for(const value of ['0','-1','1.001','1e3','NaN','999999999999999999'])assert.throws(()=>dollarsToCents(value));
});
test('quote input is bounded and cannot change provider state or dates silently',()=>{
 const quote=quoteInput({title:' Website ',scope:'Design and build',amount:'2500.50',due_date:'2026-12-01',status:'draft',square_invoice_id:'bad'});
 assert.equal(quote.amount_cents,250050);assert.equal(quote.title,'Website');assert.equal('square_invoice_id' in quote,false);
 assert.throws(()=>quoteInput({...quote,amount:'50',due_date:'2026-02-30'}));
 assert.throws(()=>quoteInput({...quote,amount:'50',status:'paid'}));
});
test('estimate references only allow native HTTPS Square links',()=>{
 assert.equal(squareEstimateUrl('https://app.squareup.com/dashboard/invoices/estimates'),'https://app.squareup.com/dashboard/invoices/estimates');
 for(const value of ['javascript:alert(1)','https://squareup.com.evil.test/x','https://user:pass@squareup.com/x','http://squareup.com/x'])assert.throws(()=>squareEstimateUrl(value));
});
test('CRM counts staff outcomes separately and never adds duplicate invoice payments',()=>{
 const totals=crmTotals([{stage:'qualified'},{stage:'proposal'},{stage:'won'},{stage:'closed'},{stage:'lost'}], [{square_invoice_id:'i1',net_collected_cents:10000},{square_invoice_id:'i1',net_collected_cents:10000},{square_invoice_id:'i2',net_collected_cents:null}]);
 assert.deepEqual(totals,{qualified:1,proposal:1,won:1,lost:1,closed:1,netCollectedCents:10000,unavailableInvoices:1,measuredInvoices:1});
});
