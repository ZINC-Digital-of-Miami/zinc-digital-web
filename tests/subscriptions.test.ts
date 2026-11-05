import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SERVICE_SLUGS} from '../src/lib/inquiry.ts';
import {subscriptionTopics, subscriptionTopic, subscriptionHref, matchesSubscriptionLists} from '../src/lib/subscription-topics.ts';

test('subscription choices cover every registered service exactly once', () => {
  assert.deepEqual(subscriptionTopics.filter(topic => (SERVICE_SLUGS as readonly string[]).includes(topic.slug)).map(topic => topic.slug).sort(), [...SERVICE_SLUGS].sort());
  assert.deepEqual(subscriptionTopics.filter(topic => !(SERVICE_SLUGS as readonly string[]).includes(topic.slug)).map(topic => topic.slug).sort(), ['analytics','brand-development','content-marketing','databases','market-analysis']);
  assert.equal(new Set(subscriptionTopics.map(topic => topic.slug)).size, subscriptionTopics.length);
  assert.equal(new Set(subscriptionTopics.map(topic => topic.listId)).size, subscriptionTopics.length);
  for (const topic of subscriptionTopics) assert.match(topic.listId, /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/);
});

test('a contextual subscription selects one exact subject without broadening consent', () => {
  assert.equal(subscriptionHref('web-design'), '/subscribe/?topic=web-design');
  assert.equal(subscriptionTopic('web-design')?.title, 'Web Design');
  for (const value of [undefined, null, '', 'Web Design', 'web-design,seo', 'all', 'https://example.com', '<script>']) {
    assert.equal(subscriptionTopic(value), undefined);
    assert.equal(subscriptionHref(value ?? undefined), '/subscribe/');
  }
});


test('provider inventory must match all approved interests, without missing, extra or duplicated lists', () => {
  const ids = subscriptionTopics.map(topic => topic.listId);
  assert.equal(matchesSubscriptionLists(ids), true);
  assert.equal(matchesSubscriptionLists([...ids].reverse()), true);
  assert.equal(matchesSubscriptionLists(ids.slice(0, 11)), false);
  assert.equal(matchesSubscriptionLists([...ids, 'unapproved-list']), false);
  assert.equal(matchesSubscriptionLists([...ids.slice(1), ids[1]]), false);
  assert.equal(matchesSubscriptionLists([...ids.slice(1), 'unapproved-list']), false);
  for (const slug of ['analytics','market-analysis','databases','content-marketing','brand-development']) {
    assert.equal(subscriptionHref(slug), '/subscribe/?topic=' + slug);
    assert.ok(subscriptionTopic(slug));
  }
});
